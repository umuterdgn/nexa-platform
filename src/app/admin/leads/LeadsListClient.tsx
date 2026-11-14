"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Target,
  Download,
  Mail,
  CheckCircle2,
  RefreshCw,
  Search,
  ExternalLink,
  Users,
  Inbox,
  PlusCircle,
} from "lucide-react";

export interface LeadItem {
  id: string;
  name?: string | null;
  email: string;
  source: string;
  status?: string;
  createdAt: string;
}

export function LeadsListClient({
  initialLeads,
}: {
  initialLeads: LeadItem[];
}) {
  const [leads, setLeads] = useState<LeadItem[]>(initialLeads);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  const fetchLeads = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/leads");
      const data = await res.json();
      if (data.success) {
        setLeads(data.leads);
      }
    } catch (err) {
      console.error("Leads yüklenemedi:", err);
    } finally {
      setLoading(false);
    }
  };

  const filteredLeads = leads.filter(
    (l) =>
      l.email.toLowerCase().includes(search.toLowerCase()) ||
      l.source.toLowerCase().includes(search.toLowerCase())
  );

  // En sık kullanılan kaynağı dinamik hesapla
  const topSource =
    leads.length > 0 ? leads[0].source : "Henüz Kayıt Yok";

  const exportCSV = () => {
    const headers = "ID,Email,Kaynak,Tarih\n";
    const rows = leads
      .map(
        (l) =>
          `"${l.id}","${l.email}","${l.source}","${new Date(l.createdAt).toLocaleString("tr-TR")}"`
      )
      .join("\n");
    const blob = new Blob([headers + rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `nexa-leads-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-6 sm:p-10 space-y-8 bg-slate-950 min-h-screen">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.08] pb-6">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-0.5 text-xs font-mono text-emerald-400">
            <Target className="h-3.5 w-3.5" />
            Prisma ORM &bull; Lead Generation Hub
          </div>
          <h1 className="mt-2 font-display text-2xl sm:text-3xl font-extrabold text-white">
            Potansiyel Müşteriler (Leads)
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400">
            Web formları ve dönüşüm hunilerinden Prisma veritabanına kaydedilen kurumsal e-postalar.
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          <button
            type="button"
            onClick={fetchLeads}
            className="p-2.5 rounded-xl border border-white/10 bg-zinc-900 text-zinc-400 hover:text-white hover:bg-zinc-800 transition cursor-pointer"
            title="Yenile"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          </button>
          <button
            type="button"
            onClick={exportCSV}
            disabled={leads.length === 0}
            className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-zinc-900 px-4 py-2.5 text-xs font-semibold text-white hover:bg-zinc-800 transition disabled:opacity-40 cursor-pointer"
          >
            <Download className="h-4 w-4 text-emerald-400" />
            <span>CSV Dışa Aktar</span>
          </button>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="rounded-2xl border border-white/[0.08] bg-zinc-950/60 p-5">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-xs font-mono uppercase">Toplam Toplanan Lead</span>
            <Users className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="mt-2 font-mono text-3xl font-bold text-white">{leads.length}</div>
          <p className="mt-1 text-[11px] text-emerald-400 font-mono">Prisma `Lead` Tablosu</p>
        </div>

        <div className="rounded-2xl border border-white/[0.08] bg-zinc-950/60 p-5">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-xs font-mono uppercase">Son Kayıt Kaynağı</span>
            <Target className="h-4 w-4 text-blue-400" />
          </div>
          <div className="mt-2 font-mono text-lg font-bold text-white truncate">
            {topSource}
          </div>
          <p className="mt-1 text-[11px] text-blue-400 font-mono">Dinamik Kaynak Bilgisi</p>
        </div>
      </div>

      {/* Search and Table */}
      <div className="rounded-2xl border border-white/[0.08] bg-zinc-950/60 overflow-hidden">
        <div className="p-4 border-b border-white/[0.06] flex items-center justify-between gap-4">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="E-posta veya kaynak ara..."
              className="w-full rounded-xl border border-white/10 bg-zinc-900/60 pl-9 pr-3 py-1.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500/50"
            />
          </div>
          <div className="text-xs font-mono text-zinc-500">
            Gösterilen: {filteredLeads.length} Lead
          </div>
        </div>

        {loading ? (
          <div className="py-20 text-center text-xs text-zinc-500 font-mono">
            Lead verileri yükleniyor...
          </div>
        ) : leads.length === 0 ? (
          <div className="py-16 px-6 text-center space-y-4">
            <div className="mx-auto w-14 h-14 rounded-2xl bg-zinc-900 border border-white/10 flex items-center justify-center text-emerald-400">
              <Inbox className="w-6 h-6" />
            </div>
            <div className="space-y-1 max-w-md mx-auto">
              <h3 className="text-base font-bold text-white">
                Henüz veri bulunmuyor
              </h3>
              <p className="text-xs text-zinc-400">
                Henüz veri bulunmuyor. Yeni bir kayıt eklemek için butona tıklayın.
              </p>
            </div>
            <div className="pt-2">
              <Link
                href="/admin/crm"
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-green-400 px-5 py-2.5 text-xs font-bold text-zinc-950 shadow-lg transition"
              >
                <PlusCircle className="w-4 h-4" />
                <span>CRM Ekranından Yeni Lead Ekle</span>
              </Link>
            </div>
          </div>
        ) : filteredLeads.length === 0 ? (
          <div className="py-16 text-center text-sm text-zinc-400">
            Aramaya uygun kayıt bulunamadı.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-white/[0.08] bg-zinc-900/40 font-mono text-[11px] uppercase tracking-wider text-zinc-400">
                <tr>
                  <th className="py-3.5 px-4">E-posta</th>
                  <th className="py-3.5 px-4">Kaynak (Source)</th>
                  <th className="py-3.5 px-4">Kayıt Tarihi</th>
                  <th className="py-3.5 px-4">Durum</th>
                  <th className="py-3.5 px-4 text-right">Aksiyon</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {filteredLeads.map((item) => (
                  <tr key={item.id} className="hover:bg-zinc-900/40 transition-colors">
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <Mail className="h-3.5 w-3.5 text-emerald-400" />
                        <span className="font-mono text-white font-semibold">{item.email}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className="rounded bg-zinc-800 px-2 py-0.5 font-mono text-[10px] text-zinc-300 border border-white/5">
                        {item.source}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap font-mono text-[11px] text-zinc-400">
                      {new Date(item.createdAt).toLocaleString("tr-TR")}
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400 font-medium">
                        <CheckCircle2 className="h-3 w-3" /> {item.status || "NEW"}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <Link
                        href="/admin/crm"
                        className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400 hover:text-emerald-300"
                      >
                        <span>CRM&apos;de Yönet</span>
                        <ExternalLink className="h-3 w-3" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

