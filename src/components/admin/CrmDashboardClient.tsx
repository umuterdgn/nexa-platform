"use client";

import React, { useState, useMemo } from "react";
import {
  Users,
  Building2,
  Mail,
  Phone,
  Clock,
  CheckCircle2,
  ArrowRight,
  Search,
  RefreshCw,
  Sparkles,
  Inbox,
  Filter,
  ChevronRight,
  TrendingUp,
  XCircle,
  AlertCircle,
  Send,
  PlusCircle,
  Link2,
  Copy,
  Check,
  Briefcase,
  LayoutGrid,
  Table as TableIcon,
  Trash2,
  ExternalLink,
  HelpCircle,
  Zap,
} from "lucide-react";
import type { CrmLead, LeadStatus } from "@/lib/services/crm-service";

interface Props {
  initialLeads: CrmLead[];
}

const STAGES: {
  key: LeadStatus;
  title: string;
  badgeClass: string;
  dotColor: string;
  borderHover: string;
}[] = [
  {
    key: "NEW",
    title: "Yeni Adaylar",
    badgeClass: "bg-amber-500/10 text-amber-400 border-amber-500/30",
    dotColor: "bg-amber-400",
    borderHover: "hover:border-amber-500/50",
  },
  {
    key: "CONTACTED",
    title: "İletişime Geçildi",
    badgeClass: "bg-cyan-500/10 text-cyan-400 border-cyan-500/30",
    dotColor: "bg-cyan-400",
    borderHover: "hover:border-cyan-500/50",
  },
  {
    key: "EMAILED",
    title: "Mail Gönderildi",
    badgeClass: "bg-blue-500/10 text-blue-400 border-blue-500/30",
    dotColor: "bg-blue-400",
    borderHover: "hover:border-blue-500/50",
  },
  {
    key: "MEETING_SET",
    title: "Toplantı Alındı",
    badgeClass: "bg-purple-500/10 text-purple-400 border-purple-500/30",
    dotColor: "bg-purple-400",
    borderHover: "hover:border-purple-500/50",
  },
  {
    key: "CLOSED",
    title: "Satış Kapandı",
    badgeClass: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
    dotColor: "bg-emerald-400",
    borderHover: "hover:border-emerald-500/50",
  },
  {
    key: "LOST",
    title: "Kayıp / Pasif",
    badgeClass: "bg-slate-500/10 text-slate-400 border-slate-500/30",
    dotColor: "bg-slate-500",
    borderHover: "hover:border-slate-500/50",
  },
];

const CAMPAIGN_OPTIONS = [
  "Tümü",
  "Nexa ERP",
  "Franchise",
  "POS",
  "E-Ticaret",
  "Custom Software",
];

export function CrmDashboardClient({ initialLeads }: Props) {
  const [leads, setLeads] = useState<CrmLead[]>(initialLeads);
  const [viewMode, setViewMode] = useState<"kanban" | "table">("kanban");
  const [search, setSearch] = useState("");
  const [selectedCampaign, setSelectedCampaign] = useState("Tümü");
  const [selectedStatus, setSelectedStatus] = useState<string>("Tümü");

  // Yükleme & Aksiyon durumları
  const [sendingMailId, setSendingMailId] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [copiedWebhook, setCopiedWebhook] = useState(false);

  // Modallar
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isWebhookModalOpen, setIsWebhookModalOpen] = useState(false);

  // Yeni Lead Form State
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    jobTitle: "",
    phone: "",
    campaignType: "Nexa ERP",
    source: "Manuel",
    notes: "",
    sendColdMailNow: true,
  });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Filtreleme
  const filteredLeads = useMemo(() => {
    return leads.filter((l) => {
      const q = search.toLowerCase();
      const matchesSearch =
        !q ||
        l.name.toLowerCase().includes(q) ||
        (l.company && l.company.toLowerCase().includes(q)) ||
        (l.companyName && l.companyName.toLowerCase().includes(q)) ||
        l.email.toLowerCase().includes(q) ||
        (l.jobTitle && l.jobTitle.toLowerCase().includes(q)) ||
        (l.campaignType && l.campaignType.toLowerCase().includes(q));

      const matchesCampaign =
        selectedCampaign === "Tümü" ||
        (l.campaignType && l.campaignType.toLowerCase().includes(selectedCampaign.toLowerCase()));

      const matchesStatus =
        selectedStatus === "Tümü" || l.status === selectedStatus;

      return matchesSearch && matchesCampaign && matchesStatus;
    });
  }, [leads, search, selectedCampaign, selectedStatus]);

  // Metrik Hesaplamaları
  const metrics = useMemo(() => {
    const total = leads.length;
    const newCount = leads.filter((l) => l.status === "NEW").length;
    const contactedCount = leads.filter((l) => l.status === "CONTACTED").length;
    const emailedCount = leads.filter((l) => l.status === "EMAILED").length;
    const meetingCount = leads.filter((l) => l.status === "MEETING_SET").length;
    const closedCount = leads.filter((l) => l.status === "CLOSED").length;
    const conversionRate = total > 0 ? Math.round((closedCount / total) * 100) : 0;

    return { total, newCount, contactedCount, emailedCount, meetingCount, closedCount, conversionRate };
  }, [leads]);

  // Aşama Değiştirme
  const handleStageChange = async (leadId: string, newStatus: LeadStatus) => {
    setUpdatingId(leadId);
    setLeads((prev) =>
      prev.map((l) => (l.id === leadId ? { ...l, status: newStatus } : l))
    );

    try {
      const res = await fetch("/api/admin/crm", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ leadId, status: newStatus }),
      });
      if (res.ok) {
        showToast(`Durum "${newStatus}" olarak güncellendi.`);
      }
    } catch (err) {
      console.error("Aşama güncellenemedi:", err);
    } finally {
      setUpdatingId(null);
    }
  };

  // Otomatik Kurumsal Mail Yolla (B2B Lead Follow-Up via /api/admin/send-lead-email)
  const handleSendLeadAckEmail = async (lead: CrmLead) => {
    setSendingMailId(lead.id);

    try {
      const res = await fetch("/api/admin/send-lead-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          leadId: lead.id,
          email: lead.email,
          name: lead.name,
          company: lead.company || lead.companyName,
          requestedProduct: lead.requestedProduct || lead.campaignType || lead.productTitle || "Nexa ERP",
          message: lead.message || lead.notes,
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setLeads((prev) =>
          prev.map((l) =>
            l.id === lead.id
              ? {
                  ...l,
                  status: "CONTACTED",
                  emailCount: (l.emailCount || 0) + 1,
                  lastEmailedAt: new Date().toISOString(),
                }
              : l
          )
        );
        showToast(
          data.simulated
            ? `(Simülasyon) ${lead.name} kişisine 'Talebiniz Alındı' kurumsal maili iletildi ve durum CONTACTED yapıldı.`
            : `${lead.email} adresine kurumsal e-posta başarıyla iletildi. Durum: CONTACTED (İletişime Geçildi).`
        );
      } else {
        alert(data.error || "E-posta gönderimi başarısız oldu.");
      }
    } catch (err) {
      console.error("Otomatik mail gönderme hatası:", err);
      alert("Sunucu bağlantı hatası oluştu.");
    } finally {
      setSendingMailId(null);
    }
  };

  // Soğuk E-Posta Tetikleyici (Resend)
  const handleSendColdMail = async (lead: CrmLead) => {
    setSendingMailId(lead.id);

    try {
      const res = await fetch("/api/crm/send-cold-mail", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          leadId: lead.id,
          campaignType: lead.campaignType || "Nexa ERP",
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setLeads((prev) =>
          prev.map((l) =>
            l.id === lead.id
              ? {
                  ...l,
                  status: "EMAILED",
                  emailCount: (l.emailCount || 0) + 1,
                  lastEmailedAt: new Date().toISOString(),
                }
              : l
          )
        );
        showToast(
          data.simulated
            ? `(Dev Simülasyon) ${lead.name} kişisine soğuk mail atıldı!`
            : `${lead.email} adresine kişiselleştirilmiş soğuk mail başarıyla gönderildi!`
        );
      } else {
        alert(data.error || "E-posta gönderimi başarısız oldu.");
      }
    } catch (err) {
      console.error("Soğuk mail gönderme hatası:", err);
      alert("Sunucu bağlantı hatası oluştu.");
    } finally {
      setSendingMailId(null);
    }
  };

  // Lead Silme
  const handleDeleteLead = async (leadId: string) => {
    if (!confirm("Bu potansiyel müşteriyi CRM listesinden silmek istediğinize emin misiniz?")) return;

    setDeletingId(leadId);
    setLeads((prev) => prev.filter((l) => l.id !== leadId));

    try {
      await fetch(`/api/admin/crm?id=${leadId}`, { method: "DELETE" });
      showToast("Kayıt silindi.");
    } catch (err) {
      console.error(err);
    } finally {
      setDeletingId(null);
    }
  };

  // Yeni Manuel Lead Ekleme
  const handleAddLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch("/api/admin/crm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setLeads((prev) => [data.lead, ...prev]);
        setIsAddModalOpen(false);
        setFormData({
          name: "",
          email: "",
          company: "",
          jobTitle: "",
          phone: "",
          campaignType: "Nexa ERP",
          source: "Manuel",
          notes: "",
          sendColdMailNow: true,
        });
        showToast(data.message || "Yeni lead başarıyla CRM'e eklendi!");
      } else {
        alert(data.error || "Lead eklenemedi.");
      }
    } catch (err) {
      alert("Bağlantı hatası oluştu.");
    }
  };

  const copyWebhookUrl = () => {
    const url = "https://nxa.com.tr/api/webhooks/inbound-lead";
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(url);
      setCopiedWebhook(true);
      setTimeout(() => setCopiedWebhook(false), 2000);
    }
  };

  return (
    <div className="space-y-8">
      {/* TOAST BİLDİRİMİ */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-2xl bg-cyan-950 border border-cyan-500/50 text-cyan-200 text-xs font-mono shadow-2xl animate-in slide-in-from-bottom duration-200">
          <Sparkles className="w-4 h-4 text-cyan-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 1. ÜST KPI VE DÖNÜŞÜM ÖZETİ */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-xl">
          <span className="text-[11px] font-mono font-medium text-slate-400 uppercase">Toplam Lead</span>
          <div className="text-2xl font-black text-white mt-1">{metrics.total}</div>
        </div>

        <div className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/20 backdrop-blur-xl">
          <span className="text-[11px] font-mono font-medium text-amber-400 uppercase">Yeni Bekleyen</span>
          <div className="text-2xl font-black text-amber-300 mt-1">{metrics.newCount}</div>
        </div>

        <div className="p-4 rounded-2xl bg-blue-500/5 border border-blue-500/20 backdrop-blur-xl">
          <span className="text-[11px] font-mono font-medium text-blue-400 uppercase">Soğuk Mail Atıldı</span>
          <div className="text-2xl font-black text-blue-300 mt-1">{metrics.emailedCount}</div>
        </div>

        <div className="p-4 rounded-2xl bg-purple-500/5 border border-purple-500/20 backdrop-blur-xl">
          <span className="text-[11px] font-mono font-medium text-purple-400 uppercase">Toplantı Alındı</span>
          <div className="text-2xl font-black text-purple-300 mt-1">{metrics.meetingCount}</div>
        </div>

        <div className="p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/20 backdrop-blur-xl">
          <span className="text-[11px] font-mono font-medium text-emerald-400 uppercase">Kazanılan (Closed)</span>
          <div className="text-2xl font-black text-emerald-300 mt-1">{metrics.closedCount}</div>
        </div>

        <div className="p-4 rounded-2xl bg-cyan-500/5 border border-cyan-500/20 backdrop-blur-xl">
          <span className="text-[11px] font-mono font-medium text-cyan-400 uppercase">Dönüşüm Oranı</span>
          <div className="text-2xl font-black text-cyan-300 mt-1">%{metrics.conversionRate}</div>
        </div>
      </div>

      {/* 2. EYLEM ÇUBUĞU, GÖRÜNÜM SEÇİCİ VE FİLTRELER */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
        {/* Arama ve Kampanya Filtresi */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative min-w-[240px]">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="İsim, şirket, ünvan veya e-posta ara..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition"
            />
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-xs font-mono text-slate-400">Kampanya:</span>
            <select
              value={selectedCampaign}
              onChange={(e) => setSelectedCampaign(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-cyan-300 font-mono outline-none focus:border-cyan-500"
            >
              {CAMPAIGN_OPTIONS.map((c) => (
                <option key={c} value={c} className="bg-slate-900 text-white">
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-xs font-mono text-slate-400">Durum:</span>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300 font-mono outline-none focus:border-cyan-500"
            >
              <option value="Tümü">Tümü</option>
              <option value="NEW">Yeni</option>
              <option value="CONTACTED">İletişime Geçildi</option>
              <option value="EMAILED">Mail Gönderildi</option>
              <option value="MEETING_SET">Toplantı Alındı</option>
              <option value="CLOSED">Satış Kapandı</option>
              <option value="LOST">Kayıp</option>
            </select>
          </div>
        </div>

        {/* Görünüm Değiştirici ve Aksiyon Butonları */}
        <div className="flex items-center gap-2.5">
          {/* Kanban / Tablo Toggle */}
          <div className="flex items-center p-1 bg-slate-950 border border-slate-800 rounded-xl">
            <button
              type="button"
              onClick={() => setViewMode("kanban")}
              className={`p-1.5 rounded-lg text-xs font-mono flex items-center gap-1.5 transition ${
                viewMode === "kanban"
                  ? "bg-slate-800 text-cyan-300 font-bold shadow-sm"
                  : "text-slate-400 hover:text-white"
              }`}
              title="Kanban Panosu"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Kanban</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode("table")}
              className={`p-1.5 rounded-lg text-xs font-mono flex items-center gap-1.5 transition ${
                viewMode === "table"
                  ? "bg-slate-800 text-cyan-300 font-bold shadow-sm"
                  : "text-slate-400 hover:text-white"
              }`}
              title="Veri Tablosu"
            >
              <TableIcon className="w-3.5 h-3.5" />
              <span>Tablo</span>
            </button>
          </div>

          {/* Webhook Bilgi Butonu */}
          <button
            type="button"
            onClick={() => setIsWebhookModalOpen(true)}
            className="px-3 py-2 rounded-xl border border-slate-800 bg-slate-950 hover:bg-slate-800 text-xs font-mono text-slate-300 hover:text-white flex items-center gap-1.5 transition"
            title="Make.com ve PhantomBuster Webhook Entegrasyonu"
          >
            <Link2 className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">PhantomBuster Webhook</span>
          </button>

          {/* + Manuel Lead Ekle */}
          <button
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-xs font-bold text-white shadow-lg shadow-cyan-500/20 flex items-center gap-1.5 transition active:scale-95 cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>+ Manuel Lead Ekle</span>
          </button>
        </div>
      </div>

      {/* 3. BOŞ DURUM (EMPTY STATE) VEYA KANBAN / TABLO GÖRÜNÜMÜ */}
      {leads.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-slate-800 bg-slate-900/40 backdrop-blur-xl p-16 text-center space-y-5">
          <div className="mx-auto w-16 h-16 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center text-cyan-400">
            <Inbox className="w-8 h-8" />
          </div>
          <div className="space-y-1.5 max-w-md mx-auto">
            <h3 className="text-lg font-bold text-white">
              Henüz veri bulunmuyor
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Henüz veri bulunmuyor. Yeni bir kayıt eklemek için butona tıklayın.
            </p>
          </div>
          <div>
            <button
              type="button"
              onClick={() => setIsAddModalOpen(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-xs font-bold text-white shadow-lg shadow-cyan-500/20 transition cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>+ Manuel Lead Ekle</span>
            </button>
          </div>
        </div>
      ) : viewMode === "kanban" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-6 gap-4 items-start">
          {STAGES.map((col) => {
            const colLeads = filteredLeads.filter((l) => l.status === col.key);

            return (
              <div
                key={col.key}
                className="rounded-3xl border border-slate-800/80 bg-slate-900/40 p-4 backdrop-blur-xl flex flex-col min-h-[600px]"
              >
                {/* Kolon Başlığı */}
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800/80 px-1">
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${col.dotColor}`} />
                    <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-white">
                      {col.title}
                    </h3>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full border text-[11px] font-mono font-bold ${col.badgeClass}`}>
                    {colLeads.length}
                  </span>
                </div>

                {/* Kart Listesi */}
                <div className="space-y-3 flex-1">
                  {colLeads.length === 0 ? (
                    <div className="py-12 text-center text-xs text-slate-500 font-mono">
                      Bu aşamada aday yok
                    </div>
                  ) : (
                    colLeads.map((lead) => {
                      const isSending = sendingMailId === lead.id;

                      return (
                        <div
                          key={lead.id}
                          className={`group relative p-4 rounded-2xl border border-slate-800 bg-slate-950/80 transition-all duration-200 hover:shadow-xl hover:shadow-cyan-500/5 ${col.borderHover}`}
                        >
                          {/* İsim & Şirket */}
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <h4 className="text-sm font-bold text-white group-hover:text-cyan-300 transition">
                                {lead.name}
                              </h4>
                              {(lead.company || lead.companyName) && (
                                <p className="text-xs text-slate-300 font-medium flex items-center gap-1 mt-0.5">
                                  <Building2 className="w-3 h-3 text-slate-500 shrink-0" />
                                  <span className="truncate">{lead.company || lead.companyName}</span>
                                </p>
                              )}
                              {lead.jobTitle && (
                                <p className="text-[11px] text-cyan-400/90 font-mono flex items-center gap-1 mt-0.5">
                                  <Briefcase className="w-3 h-3 text-cyan-500 shrink-0" />
                                  <span className="truncate">{lead.jobTitle}</span>
                                </p>
                              )}
                            </div>

                            <button
                              type="button"
                              onClick={() => handleDeleteLead(lead.id)}
                              className="text-slate-600 hover:text-rose-400 p-1 rounded opacity-0 group-hover:opacity-100 transition"
                              title="Kaydı Sil"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          {/* Kampanya Türü & Kaynak Rozetleri */}
                          <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
                            {lead.campaignType && (
                              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 font-semibold">
                                🎯 {lead.campaignType}
                              </span>
                            )}
                            {lead.source && (
                              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                                {lead.source.replace("_", " ")}
                              </span>
                            )}
                          </div>

                          {/* Notlar */}
                          {lead.notes && (
                            <p className="mt-2 text-xs text-slate-400 line-clamp-2 leading-relaxed">
                              {lead.notes}
                            </p>
                          )}

                          {/* İletişim Bilgileri */}
                          <div className="mt-3 pt-2.5 border-t border-slate-800/60 space-y-1 text-xs font-mono">
                            <a
                              href={`mailto:${lead.email}`}
                              className="flex items-center gap-1.5 text-slate-400 hover:text-cyan-300 transition truncate"
                            >
                              <Mail className="w-3.5 h-3.5 text-cyan-500 shrink-0" />
                              <span className="truncate">{lead.email}</span>
                            </a>
                            {lead.phone && (
                              <a
                                href={`tel:${lead.phone}`}
                                className="flex items-center gap-1.5 text-slate-400 hover:text-emerald-400 transition"
                              >
                                <Phone className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                                <span>{lead.phone}</span>
                              </a>
                            )}
                          </div>

                          {/* Mail Gönderim Durumu & İstatistik */}
                          <div className="mt-2.5 pt-2 border-t border-slate-900 flex items-center justify-between text-[10px] font-mono">
                            {lead.emailCount > 0 ? (
                              <span className="text-blue-400 flex items-center gap-1 font-semibold">
                                <CheckCircle2 className="w-3 h-3 text-blue-400" />
                                {lead.emailCount} kez yollandı
                              </span>
                            ) : (
                              <span className="text-slate-500 italic">Henüz mail atılmadı</span>
                            )}

                            {lead.lastEmailedAt && (
                              <span className="text-slate-500">
                                {new Date(lead.lastEmailedAt).toLocaleDateString("tr-TR", {
                                  day: "numeric",
                                  month: "short",
                                })}
                              </span>
                            )}
                          </div>

                          {/* ÖNEMLİ AKSİYON: [Otomatik Mail Yolla] & Aşama */}
                          <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between gap-2">
                            <button
                              type="button"
                              onClick={() => handleSendLeadAckEmail(lead)}
                              disabled={isSending}
                              className={`flex-1 py-1.5 px-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer shadow-sm ${
                                lead.status === "CONTACTED"
                                  ? "bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-cyan-500/30"
                                  : "bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white shadow-cyan-500/20"
                              }`}
                              title="Resend üzerinden 'Talebiniz alınmıştır' kurumsal e-postasını gönder ve aşamayı CONTACTED yap"
                            >
                              {isSending ? (
                                <>
                                  <RefreshCw className="w-3 h-3 animate-spin" />
                                  <span>İletiliyor...</span>
                                </>
                              ) : (
                                <>
                                  <Send className="w-3 h-3" />
                                  <span>{lead.status === "CONTACTED" ? "Tekrar Mail Yolla" : "Otomatik Mail Yolla"}</span>
                                </>
                              )}
                            </button>

                            <select
                              value={lead.status}
                              onChange={(e) => handleStageChange(lead.id, e.target.value as LeadStatus)}
                              className="bg-slate-900 border border-slate-800 rounded-lg px-2 py-1.5 text-[11px] text-slate-300 font-mono outline-none"
                            >
                              <option value="NEW">Yeni</option>
                              <option value="CONTACTED">İletişime Geçildi</option>
                              <option value="EMAILED">Mail Atıldı</option>
                              <option value="MEETING_SET">Toplantı</option>
                              <option value="CLOSED">Kapandı</option>
                              <option value="LOST">Kayıp</option>
                            </select>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* 4. VERİ TABLOSU GÖRÜNÜMÜ (DATA TABLE) */
        <div className="rounded-2xl border border-slate-800 bg-slate-900/40 backdrop-blur-xl overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="border-b border-slate-800 bg-slate-950/80 text-[11px] font-mono uppercase text-slate-400 tracking-wider">
                <tr>
                  <th className="py-4 px-6">Müşteri & Şirket</th>
                  <th className="py-4 px-6">Kampanya / Ürün</th>
                  <th className="py-4 px-6">Kaynak</th>
                  <th className="py-4 px-6">Aşama / Durum</th>
                  <th className="py-4 px-6">Mail Durumu</th>
                  <th className="py-4 px-6 text-right">Otonom Aksiyon</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {filteredLeads.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-slate-500 text-xs font-mono">
                      Filtreye uygun müşteri kaydı bulunamadı.
                    </td>
                  </tr>
                ) : (
                  filteredLeads.map((lead) => {
                    const isSending = sendingMailId === lead.id;

                    return (
                      <tr key={lead.id} className="hover:bg-slate-800/30 transition-colors group">
                        {/* Müşteri & Şirket */}
                        <td className="py-4 px-6">
                          <div className="font-bold text-white text-base group-hover:text-cyan-300 transition">
                            {lead.name}
                          </div>
                          {(lead.company || lead.companyName) && (
                            <div className="text-xs text-slate-400 font-medium flex items-center gap-1 mt-0.5">
                              <Building2 className="w-3 h-3 text-slate-500" />
                              <span>{lead.company || lead.companyName}</span>
                            </div>
                          )}
                          {lead.jobTitle && (
                            <div className="text-[11px] text-cyan-400 font-mono mt-0.5">
                              {lead.jobTitle}
                            </div>
                          )}
                          <div className="text-xs font-mono text-slate-500 mt-1">
                            {lead.email}
                          </div>
                        </td>

                        {/* Kampanya */}
                        <td className="py-4 px-6">
                          <span className="inline-block text-xs font-mono px-2.5 py-1 rounded-lg bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 font-bold">
                            {lead.campaignType || "Nexa ERP"}
                          </span>
                        </td>

                        {/* Kaynak */}
                        <td className="py-4 px-6">
                          <span className="inline-block text-xs font-mono px-2.5 py-1 rounded bg-slate-800 text-slate-300">
                            {lead.source}
                          </span>
                        </td>

                        {/* Durum Dropdown */}
                        <td className="py-4 px-6">
                          <select
                            value={lead.status}
                            onChange={(e) => handleStageChange(lead.id, e.target.value as LeadStatus)}
                            className="bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-1.5 text-xs font-mono text-white outline-none focus:border-cyan-500"
                          >
                            <option value="NEW">Yeni (NEW)</option>
                            <option value="CONTACTED">İletişime Geçildi (CONTACTED)</option>
                            <option value="EMAILED">Soğuk Mail (EMAILED)</option>
                            <option value="MEETING_SET">Toplantı Alındı (MEETING_SET)</option>
                            <option value="CLOSED">Satış Kapandı (CLOSED)</option>
                            <option value="LOST">Kayıp (LOST)</option>
                          </select>
                        </td>

                        {/* Mail Gönderim Bilgisi */}
                        <td className="py-4 px-6 text-xs font-mono">
                          {lead.emailCount > 0 ? (
                            <div>
                              <span className="text-cyan-400 font-bold flex items-center gap-1">
                                <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                                {lead.emailCount} kez gönderildi
                              </span>
                              {lead.lastEmailedAt && (
                                <span className="text-slate-500 text-[10px] block mt-0.5">
                                  {new Date(lead.lastEmailedAt).toLocaleString("tr-TR")}
                                </span>
                              )}
                            </div>
                          ) : (
                            <span className="text-slate-500 italic">Gönderilmedi</span>
                          )}
                        </td>

                        {/* Otonom Aksiyon Butonları */}
                        <td className="py-4 px-6 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => handleSendLeadAckEmail(lead)}
                              disabled={isSending}
                              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                                lead.status === "CONTACTED"
                                  ? "bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-cyan-500/30"
                                  : "bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white shadow-md shadow-cyan-500/20"
                              }`}
                              title="Resend üzerinden 'Talebiniz alınmıştır' e-postasını gönder ve aşamayı CONTACTED yap"
                            >
                              {isSending ? (
                                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                              ) : (
                                <Send className="w-3.5 h-3.5" />
                              )}
                              <span>{lead.status === "CONTACTED" ? "Tekrar Mail Yolla" : "Otomatik Mail Yolla"}</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => handleDeleteLead(lead.id)}
                              className="p-2 rounded-xl bg-slate-800 hover:bg-rose-950/60 text-slate-400 hover:text-rose-400 transition"
                              title="Sil"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 5. + MANUEL LEAD EKLEME MODALI */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 overflow-y-auto">
          <div className="relative w-full max-w-xl rounded-3xl border border-slate-800 bg-slate-900 p-6 sm:p-8 shadow-2xl my-8">
            <button
              type="button"
              onClick={() => setIsAddModalOpen(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-white p-2 rounded-xl bg-slate-800/80 transition"
            >
              ✕
            </button>

            <div className="mb-6">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400">
                Outbound B2B Lead Ekle
              </span>
              <h3 className="text-2xl font-black text-white mt-1">
                Yeni Potansiyel Müşteri Kaydı
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Kişi eklendiğinde doğrudan CRM hunisine dahil olur ve opsiyonel olarak ilk soğuk maili anında alır.
              </p>
            </div>

            <form onSubmit={handleAddLeadSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-mono text-slate-400 block mb-1">
                    Ad Soyad <span className="text-cyan-400">*</span>
                  </label>
                  <input
                    required
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Örn: Ali Yılmaz"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-mono text-slate-400 block mb-1">
                    Kurumsal E-posta <span className="text-cyan-400">*</span>
                  </label>
                  <input
                    required
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="ali@sirket.com"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-mono text-slate-400 block mb-1">Şirket / Kurum</label>
                  <input
                    type="text"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    placeholder="Örn: Yılmaz İnşaat A.Ş."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-mono text-slate-400 block mb-1">Ünvan / Pozisyon</label>
                  <input
                    type="text"
                    value={formData.jobTitle}
                    onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
                    placeholder="Örn: Genel Müdür / CTO"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-mono text-slate-400 block mb-1">Telefon</label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="0532 ..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500 font-mono"
                  />
                </div>

                <div>
                  <label className="text-xs font-mono text-slate-400 block mb-1">Kampanya Türü</label>
                  <select
                    value={formData.campaignType}
                    onChange={(e) => setFormData({ ...formData, campaignType: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-cyan-300 font-mono outline-none"
                  >
                    <option value="Nexa ERP">Nexa ERP</option>
                    <option value="Franchise">Franchise Rollout</option>
                    <option value="POS">Bulut POS & Kasa</option>
                    <option value="E-Ticaret">E-Ticaret & Filo</option>
                    <option value="Custom Software">Kurumsal Özel</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-mono text-slate-400 block mb-1">Kaynak</label>
                  <select
                    value={formData.source}
                    onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-slate-300 font-mono outline-none"
                  >
                    <option value="Manuel">Manuel Ekleme</option>
                    <option value="PhantomBuster/LinkedIn">PhantomBuster/LinkedIn</option>
                    <option value="Web Formu">Web Formu</option>
                    <option value="Referans">Referans</option>
                    <option value="Fuar/Konferans">Fuar / Konferans</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-mono text-slate-400 block mb-1">Notlar & İhtiyaç Özeti</label>
                <textarea
                  rows={2}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Müşterinin özel şantiye sayısı, mağaza ölçeği vb..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500 resize-none"
                />
              </div>

              {/* Otonom Mail Checkbox */}
              <div className="p-3.5 rounded-2xl bg-blue-950/40 border border-blue-500/30 flex items-center gap-3">
                <input
                  type="checkbox"
                  id="sendColdMailNow"
                  checked={formData.sendColdMailNow}
                  onChange={(e) => setFormData({ ...formData, sendColdMailNow: e.target.checked })}
                  className="w-4 h-4 rounded text-blue-600 focus:ring-0 bg-slate-900 border-slate-700 cursor-pointer"
                />
                <label htmlFor="sendColdMailNow" className="text-xs text-blue-200 cursor-pointer select-none">
                  <strong>Otonom Soğuk Maili Hemen Gönder:</strong> Kayıt açılır açılmaz Resend API üzerinden kişiselleştirilmiş 15 dakikalık demo daveti atılsın.
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 text-xs font-semibold transition"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-xs font-bold shadow-lg shadow-cyan-500/20 transition cursor-pointer"
                >
                  Lead&apos;i Kaydet ve Başlat
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 6. PHANTOMBUSTER & MAKE.COM WEBHOOK ENTEGRASYON MODALI */}
      {isWebhookModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 overflow-y-auto">
          <div className="relative w-full max-w-2xl rounded-3xl border border-slate-800 bg-slate-900 p-6 sm:p-8 shadow-2xl my-8">
            <button
              type="button"
              onClick={() => setIsWebhookModalOpen(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-white p-2 rounded-xl bg-slate-800/80 transition"
            >
              ✕
            </button>

            <div className="mb-6">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400">
                Otonom Outbound Entegrasyonu
              </span>
              <h3 className="text-2xl font-black text-white mt-1">
                Make.com & PhantomBuster Webhook Uç Noktası
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                PhantomBuster&apos;dan çektiğiniz LinkedIn profillerini Make.com veya doğrudan bu uç noktaya POST ederek siz uyurken dahi sisteme otomatik lead akışı sağlayabilirsiniz.
              </p>
            </div>

            <div className="space-y-4 text-xs font-mono">
              {/* Webhook URL */}
              <div>
                <label className="text-slate-400 block mb-1.5 font-bold">1. Hedef Webhook URL (POST)</label>
                <div className="flex items-center gap-2">
                  <input
                    readOnly
                    value="https://nxa.com.tr/api/webhooks/inbound-lead"
                    className="w-full bg-slate-950 border border-cyan-500/30 rounded-xl px-3.5 py-2.5 text-cyan-300 font-mono text-xs select-all outline-none"
                  />
                  <button
                    type="button"
                    onClick={copyWebhookUrl}
                    className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold transition flex items-center gap-1.5 shrink-0"
                  >
                    {copiedWebhook ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    <span>{copiedWebhook ? "Kopyalandı!" : "Kopyala"}</span>
                  </button>
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  * Otomatik mail göndermek için sonuna <code>?autoMail=true</code> ekleyebilirsiniz.
                </p>
              </div>

              {/* JSON Örneği */}
              <div>
                <label className="text-slate-400 block mb-1.5 font-bold">2. Gönderilecek Örnek JSON Payload</label>
                <pre className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-slate-300 text-[11px] overflow-x-auto leading-relaxed">
{`{
  "name": "Ahmet Yılmaz",
  "email": "ahmet@ornekinsaat.com",
  "company": "Örnek İnşaat A.Ş.",
  "jobTitle": "İnşaat Koordinatörü",
  "phone": "05321234567",
  "campaignType": "Nexa ERP",
  "source": "PhantomBuster/LinkedIn",
  "profileUrl": "https://linkedin.com/in/ahmetyilmaz",
  "autoColdMail": true
}`}
                </pre>
              </div>

              <div className="p-4 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-200 text-xs">
                <p className="font-bold mb-1 flex items-center gap-1.5">
                  <Zap className="w-4 h-4 text-cyan-400" />
                  <span>Otonom Gece Operasyonu:</span>
                </p>
                <p className="text-[11px] text-slate-300 leading-relaxed font-sans">
                  PhantomBuster scraper&apos;ı günde 20-30 hedef profil topladığında bu webhook&apos;a tetikler. Sistem her birine spama düşmeyen düz metin formatında kişiselleştirilmiş soğuk maili atar, takviminizi (Meet linkiyle) sunar ve CRM durumunu &quot;EMAILED&quot; olarak günceller.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

