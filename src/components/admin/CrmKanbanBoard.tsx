"use client";

import React, { useState } from "react";
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
} from "lucide-react";
import type { CrmLead, CrmStage } from "@/lib/services/crm-service";

interface CrmKanbanBoardProps {
  initialLeads: CrmLead[];
}

const STAGES: {
  key: CrmStage;
  title: string;
  badgeClass: string;
  dotColor: string;
  borderHover: string;
}[] = [
  {
    key: "PENDING",
    title: "Yeni Randevu",
    badgeClass: "bg-amber-500/10 text-amber-400 border-amber-500/30",
    dotColor: "bg-amber-400",
    borderHover: "hover:border-amber-500/50",
  },
  {
    key: "CONTACTED",
    title: "Mail Gönderildi",
    badgeClass: "bg-blue-500/10 text-blue-400 border-blue-500/30",
    dotColor: "bg-blue-400",
    borderHover: "hover:border-blue-500/50",
  },
  {
    key: "WON",
    title: "Satış Kapandı",
    badgeClass: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
    dotColor: "bg-emerald-400",
    borderHover: "hover:border-emerald-500/50",
  },
  {
    key: "LOST",
    title: "İptal",
    badgeClass: "bg-slate-500/10 text-slate-400 border-slate-500/30",
    dotColor: "bg-slate-500",
    borderHover: "hover:border-slate-500/50",
  },
];

export function CrmKanbanBoard({ initialLeads }: CrmKanbanBoardProps) {
  const [leads, setLeads] = useState<CrmLead[]>(initialLeads);
  const [search, setSearch] = useState("");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const filteredLeads = leads.filter((l) => {
    const q = search.toLowerCase();
    return (
      l.name.toLowerCase().includes(q) ||
      (l.companyName && l.companyName.toLowerCase().includes(q)) ||
      l.email.toLowerCase().includes(q) ||
      (l.productTitle && l.productTitle.toLowerCase().includes(q))
    );
  });

  const handleStageChange = async (leadId: string, newStatus: CrmStage) => {
    setUpdatingId(leadId);

    // İyimser UI güncellemesi (Optimistic Update)
    setLeads((prev) =>
      prev.map((l) => (l.id === leadId ? { ...l, status: newStatus } : l))
    );

    try {
      await fetch("/api/admin/crm", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ leadId, status: newStatus }),
      });
    } catch (err) {
      console.error("Aşama güncellenemedi:", err);
    } finally {
      setUpdatingId(null);
    }
  };

  const getNextStage = (current: CrmStage): CrmStage => {
    if (current === "PENDING") return "CONTACTED";
    if (current === "CONTACTED") return "WON";
    return "PENDING";
  };

  return (
    <div className="space-y-6">
      {/* ÜST ARAMA VE FİLTRELEME ÇUBUĞU */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Müşteri, şirket veya ürün ara..."
            className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/30"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
        </div>

        <div className="flex items-center gap-3 text-xs font-mono text-slate-400">
          <span>Toplam Talep: <strong className="text-white">{filteredLeads.length}</strong></span>
          <span>&bull;</span>
          <span className="text-emerald-400 font-bold">
            Kazanılan: {leads.filter((l) => l.status === "WON").length}
          </span>
        </div>
      </div>

      {/* 4 KOLONLU KANBAN BOARD */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 items-start">
        {STAGES.map((col) => {
          const colLeads = filteredLeads.filter((l) => l.status === col.key);

          return (
            <div
              key={col.key}
              className="rounded-3xl border border-slate-800/80 bg-slate-900/40 p-4 backdrop-blur-xl flex flex-col min-h-[550px]"
            >
              {/* Kolon Başlığı */}
              <div className="flex items-center justify-between pb-3.5 mb-3 border-b border-slate-800/80 px-1">
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${col.dotColor}`} />
                  <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-white">
                    {col.title}
                  </h3>
                </div>
                <span
                  className={`px-2 py-0.5 rounded-full border text-[11px] font-mono font-bold ${col.badgeClass}`}
                >
                  {colLeads.length}
                </span>
              </div>

              {/* Lead Kartları Listesi */}
              <div className="space-y-3.5 flex-1">
                {colLeads.length === 0 ? (
                  <div className="py-12 text-center text-xs text-slate-500 font-mono">
                    Bu aşamada talep yok
                  </div>
                ) : (
                  colLeads.map((lead) => (
                    <div
                      key={lead.id}
                      className={`group relative p-4 rounded-2xl border border-slate-800 bg-slate-950/70 transition-all duration-200 hover:shadow-lg hover:shadow-cyan-500/5 ${col.borderHover}`}
                    >
                      {/* Müşteri ve Şirket */}
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h4 className="text-sm font-bold text-white group-hover:text-cyan-300 transition">
                            {lead.name}
                          </h4>
                          {lead.companyName && (
                            <p className="text-xs text-slate-400 font-medium flex items-center gap-1 mt-0.5">
                              <Building2 className="w-3 h-3 text-slate-500 shrink-0" />
                              <span className="truncate">{lead.companyName}</span>
                            </p>
                          )}
                        </div>

                        {lead.source && (
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800/80 text-slate-400 shrink-0">
                            {lead.source.replace("_", " ")}
                          </span>
                        )}
                      </div>

                      {/* İlgilendiği Ürün */}
                      {lead.productTitle && (
                        <div className="mt-3 px-2.5 py-1.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs font-mono">
                          {lead.productTitle}
                        </div>
                      )}

                      {/* Notlar / Detay */}
                      {lead.notes && (
                        <p className="mt-2.5 text-xs text-slate-300 line-clamp-2 leading-relaxed">
                          {lead.notes}
                        </p>
                      )}

                      {/* İletişim Bilgileri */}
                      <div className="mt-3 pt-3 border-t border-slate-800/60 space-y-1 text-xs font-mono">
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

                      {/* Tarih ve Aşama Değiştirme Butonları */}
                      <div className="mt-3 pt-2.5 border-t border-slate-800/40 flex items-center justify-between text-[11px] font-mono">
                        <span className="text-slate-500 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {new Date(lead.createdAt).toLocaleDateString("tr-TR", {
                            day: "numeric",
                            month: "short",
                          })}
                        </span>

                        <div className="flex items-center gap-1.5">
                          {lead.status !== "WON" && (
                            <button
                              onClick={() => handleStageChange(lead.id, getNextStage(lead.status))}
                              disabled={updatingId === lead.id}
                              className="px-2.5 py-1 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 font-bold transition flex items-center gap-1 hover:scale-105"
                              title="Sonraki Aşamaya Taşı"
                            >
                              <span>İlerlet</span>
                              <ChevronRight className="w-3 h-3" />
                            </button>
                          )}

                          <select
                            value={lead.status}
                            onChange={(e) => handleStageChange(lead.id, e.target.value as CrmStage)}
                            className="bg-slate-900 border border-slate-800 rounded px-1.5 py-0.5 text-[10px] text-slate-300 outline-none"
                          >
                            <option value="PENDING">Yeni Randevu</option>
                            <option value="CONTACTED">Mail Gönderildi</option>
                            <option value="WON">Satış Kapandı</option>
                            <option value="LOST">İptal</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

