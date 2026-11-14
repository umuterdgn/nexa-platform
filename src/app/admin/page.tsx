import Link from "next/link";
import { prisma } from "@/lib/prisma";
import {
  Users,
  Package,
  TrendingUp,
  Sparkles,
  ExternalLink,
  Target,
  PlusCircle,
  Activity,
  ArrowRight,
  CheckCircle2,
  Clock,
  Inbox,
  Layers,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminOverview() {
  // Tüm Dashboard metrikleri doğrudan Prisma veritabanından çekilir (Mock data kesinlikle kullanılmaz)
  const [
    totalCustomers,
    totalActiveOrders,
    pendingLeadsCount,
    wonLeadsCount,
    recentLeads,
    recentProducts,
  ] = await Promise.all([
    prisma.user.count({ where: { role: { not: "admin" } } }).catch(() => 0),
    prisma.order.count({ where: { status: "SUCCESS" } }).catch(() => 0),
    prisma.lead.count({ where: { status: "NEW" } }).catch(() => 0),
    prisma.lead.count({ where: { status: "CLOSED" } }).catch(() => 0),
    prisma.lead
      .findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
      })
      .catch(() => []),
    prisma.product
      .findMany({
        take: 4,
        orderBy: { createdAt: "desc" },
        include: { plans: true },
      })
      .catch(() => []),
  ]);

  const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || null;

  return (
    <div className="p-6 sm:p-10 lg:p-12 space-y-10 bg-slate-950 text-slate-100 min-h-screen">
      {/* 1. KARŞILAMA VE HIZLI EYLEMLER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 border-b border-slate-800 pb-8">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-mono font-semibold uppercase tracking-wider text-cyan-400 mb-2">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span>Nexa Executive HQ &bull; Sistem Yönetim Merkezi</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Admin Kontrol Paneli
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            Canlı site trafiğini (GA4), müşteri hareketlerini, Prisma ürün kataloğunu ve CRM teklif akışını tek merkezden yönetin.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/admin/urun-ekle"
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs shadow-lg shadow-cyan-500/20 transition flex items-center gap-2"
          >
            <PlusCircle className="w-4 h-4" />
            <span>+ Dinamik Ürün / SSO Ekle</span>
          </Link>
          <Link
            href="/admin/crm"
            className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 font-bold text-xs transition flex items-center gap-2"
          >
            <Target className="w-4 h-4 text-cyan-400" />
            <span>CRM & Teklifler (Kanban)</span>
          </Link>
        </div>
      </div>

      {/* 2. CANLI ZİYARETÇİ VE TRAFİK TAKİBİ (GA4) KARTI */}
      <section className="relative overflow-hidden rounded-3xl border border-cyan-500/30 bg-gradient-to-r from-slate-900 via-blue-950/30 to-slate-900 p-6 sm:p-8 backdrop-blur-xl shadow-2xl shadow-cyan-500/10">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono font-bold">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500" />
                </span>
                {gaId ? "GA4 TELEMETRİ BAĞLI" : "GA4 YAPILANDIRMA BEKLİYOR"}
              </span>
              {gaId && (
                <span className="text-xs font-mono text-slate-400">
                  Ölçüm Kimliği: <strong className="text-white">{gaId}</strong>
                </span>
              )}
            </div>

            <h2 className="text-xl sm:text-2xl font-black text-white">
              Google Analytics 4 (GA4) Canlı Ziyaretçi & Telemetri Takibi
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              `layout.tsx` içerisine enjekte edilen GA4 motoru ile anlık ziyaretçiler, coğrafi konumlar,
              oturum süreleri ve ürün sayfaları canlı olarak takip edilmektedir.
            </p>
          </div>

          {/* GA4 Doğrudan Konsol Butonu */}
          <div className="shrink-0 flex flex-col sm:flex-row lg:flex-col gap-3">
            <a
              href="https://analytics.google.com/analytics/web/"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs shadow-lg shadow-cyan-500/25 transition flex items-center justify-center gap-2"
            >
              <Activity className="w-4 h-4" />
              <span>GA4 Gerçek Zamanlı Paneli Aç</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
            <span className="text-[11px] font-mono text-slate-400 text-center">
              Google Cloud &gt; GA4 Property Dashboard
            </span>
          </div>
        </div>
      </section>

      {/* 3. ANA PERFORMANS & PRISMA VERİTABANI METRİKLERİ */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Toplam Müşteri Portföyü (prisma.user.count) */}
        <div className="p-6 rounded-3xl border border-slate-800/80 bg-slate-900/40 backdrop-blur-xl">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400">
            <span>Toplam Müşteri</span>
            <span className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400">
              <Users className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-3 text-3xl font-black text-white">
            {totalCustomers}
          </div>
          <p className="mt-2 text-xs text-slate-400 font-mono">
            Prisma `User` tablosundaki kayıtlı müşteriler
          </p>
        </div>

        {/* Satılan / Aktif Lisans (prisma.order.count({ where: { status: 'SUCCESS' } })) */}
        <div className="p-6 rounded-3xl border border-slate-800/80 bg-slate-900/40 backdrop-blur-xl">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400">
            <span>Satılan / Aktif Lisans</span>
            <span className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
              <Package className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-3 text-3xl font-black text-white">
            {totalActiveOrders}
          </div>
          <p className="mt-2 text-xs text-emerald-400 font-mono flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" />
            <span>Onaylanan başarılı siparişler (`SUCCESS`)</span>
          </p>
        </div>

        {/* Bekleyen Teklifler / Talepler (prisma.lead.count({ where: { status: 'NEW' } })) */}
        <div className="p-6 rounded-3xl border border-slate-800/80 bg-slate-900/40 backdrop-blur-xl">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400">
            <span>Bekleyen Teklifler / Talepler</span>
            <span className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
              <Clock className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-3 text-3xl font-black text-white">
            {pendingLeadsCount}
          </div>
          <p className="mt-2 text-xs text-amber-400 font-mono">
            `NEW` statüsündeki yeni müşteri talepleri
          </p>
        </div>

        {/* Kazanılan Satışlar (prisma.lead.count({ where: { status: 'CLOSED' } })) */}
        <div className="p-6 rounded-3xl border border-slate-800/80 bg-slate-900/40 backdrop-blur-xl">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400">
            <span>Kazanılan Satışlar</span>
            <span className="p-2 rounded-xl bg-blue-500/10 text-blue-400">
              <TrendingUp className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-3 text-3xl font-black text-white">
            {wonLeadsCount}
          </div>
          <p className="mt-2 text-xs text-blue-400 font-mono">
            `CLOSED` statüsündeki tamamlanan anlaşmalar
          </p>
        </div>
      </section>

      {/* 4. SON GELEN TALEPLER TABLOSU (prisma.lead.findMany({ take: 5, orderBy: { createdAt: 'desc' } })) */}
      <section className="p-6 sm:p-8 rounded-3xl border border-slate-800/80 bg-slate-900/40 backdrop-blur-xl space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div>
            <span className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-bold block">
              Satış Hunisi & Lead Akışı (Son 5 Kayıt)
            </span>
            <h2 className="text-2xl font-black text-white tracking-tight">
              Son Gelen Talepler
            </h2>
          </div>

          <Link
            href="/admin/crm"
            className="text-xs font-mono font-bold text-cyan-400 hover:text-cyan-300 transition flex items-center gap-1.5"
          >
            <span>Tüm CRM & Kanban Panosunu Aç</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {recentLeads.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-800 bg-slate-950/50 p-12 text-center space-y-4">
            <div className="mx-auto w-12 h-12 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-500">
              <Inbox className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-white">
                Henüz veri bulunmuyor
              </h3>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                Henüz veri bulunmuyor. Yeni bir kayıt eklemek için butona tıklayın.
              </p>
            </div>
            <div>
              <Link
                href="/admin/crm"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 text-xs font-mono font-bold transition"
              >
                <PlusCircle className="w-4 h-4" />
                <span>CRM Panosundan Yeni Kayıt Ekle</span>
              </Link>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="border-b border-slate-800 bg-slate-950/60 text-[11px] font-mono uppercase text-slate-400">
                <tr>
                  <th className="py-3.5 px-4">Müşteri / Kurum</th>
                  <th className="py-3.5 px-4">E-Posta & Telefon</th>
                  <th className="py-3.5 px-4">Talep Edilen Ürün</th>
                  <th className="py-3.5 px-4">Durum</th>
                  <th className="py-3.5 px-4">Tarih</th>
                  <th className="py-3.5 px-4 text-right">İşlem</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/70">
                {recentLeads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-slate-800/30 transition">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-white">
                        {lead.name || lead.email.split("@")[0]}
                      </div>
                      {(lead.company || lead.companyName) && (
                        <div className="text-xs text-slate-400">
                          {lead.company || lead.companyName}
                        </div>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-xs font-mono">
                      <div className="text-slate-300">{lead.email}</div>
                      {lead.phone && <div className="text-slate-500">{lead.phone}</div>}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="inline-block text-xs font-mono px-2.5 py-1 rounded-lg bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                        {lead.requestedProduct || lead.campaignType || lead.productTitle || "Belirtilmedi"}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-bold border ${
                          lead.status === "NEW"
                            ? "bg-amber-500/10 text-amber-400 border-amber-500/30"
                            : lead.status === "CONTACTED"
                            ? "bg-cyan-500/10 text-cyan-400 border-cyan-500/30"
                            : lead.status === "EMAILED"
                            ? "bg-blue-500/10 text-blue-400 border-blue-500/30"
                            : lead.status === "MEETING_SET"
                            ? "bg-purple-500/10 text-purple-400 border-purple-500/30"
                            : lead.status === "CLOSED"
                            ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                            : "bg-slate-500/10 text-slate-400 border-slate-500/30"
                        }`}
                      >
                        {lead.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-xs font-mono text-slate-400">
                      {new Date(lead.createdAt).toLocaleDateString("tr-TR")}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <Link
                        href="/admin/crm"
                        className="text-xs font-mono font-bold text-cyan-400 hover:underline"
                      >
                        Yönet &rarr;
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* 5. SON EKLENEN ÜRÜNLER (prisma.product.findMany) */}
      <section className="p-6 sm:p-8 rounded-3xl border border-slate-800/80 bg-slate-900/40 backdrop-blur-xl space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-5">
          <div>
            <span className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-bold block">
              Prisma Veritabanı Kataloğu
            </span>
            <h2 className="text-2xl font-black text-white tracking-tight">
              Kayıtlı SaaS ve Platform Ürünleri
            </h2>
          </div>

          <Link
            href="/admin/urun-ekle"
            className="text-xs font-mono font-bold text-cyan-400 hover:text-cyan-300 transition flex items-center gap-1.5"
          >
            <span>+ Yeni Ürün Ekle</span>
            <PlusCircle className="w-4 h-4" />
          </Link>
        </div>

        {recentProducts.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-800 bg-slate-950/50 p-12 text-center space-y-4">
            <div className="mx-auto w-12 h-12 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-500">
              <Layers className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-white">
                Henüz veri bulunmuyor
              </h3>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                Henüz veri bulunmuyor. Yeni bir kayıt eklemek için butona tıklayın.
              </p>
            </div>
            <div>
              <Link
                href="/admin/urun-ekle"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 text-xs font-mono font-bold transition"
              >
                <PlusCircle className="w-4 h-4" />
                <span>+ Yeni Ürün / SSO Ekle</span>
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {recentProducts.map((item) => {
              const firstPlan = item.plans?.[0];
              const priceDisplay =
                item.pricingType === "QUOTE_BASED"
                  ? "Özel Teklif"
                  : firstPlan
                  ? `${Number(firstPlan.monthlyPrice).toLocaleString("tr-TR")} ₺`
                  : "Belirtilmedi";

              return (
                <div
                  key={item.id}
                  className="p-5 rounded-2xl border border-slate-800 bg-slate-950/60 space-y-3"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-bold text-white truncate">
                      {item.title}
                    </span>
                    {item.badge && (
                      <span className="px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 text-[10px] font-mono shrink-0">
                        {item.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-xs font-mono text-cyan-300">
                    Fiyat: <strong className="text-white">{priceDisplay}</strong>
                  </p>
                  <div className="pt-2 border-t border-slate-800/80 text-[11px] font-mono text-slate-400 truncate">
                    SSO:{" "}
                    <span className="text-slate-300">
                      {item.ssoUrl || "Tanımlanmadı"}
                    </span>
                  </div>
                  <div className="pt-1 flex items-center justify-between text-xs">
                    <Link
                      href={`/urunler/${item.slug}`}
                      target="_blank"
                      className="text-cyan-400 hover:underline font-mono text-xs flex items-center gap-1"
                    >
                      <span>Vitrin Sayfası</span>
                      <ExternalLink className="w-3 h-3" />
                    </Link>
                    <Link
                      href="/admin/urunler"
                      className="text-emerald-400 hover:underline font-mono text-xs"
                    >
                      Düzenle &rarr;
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
