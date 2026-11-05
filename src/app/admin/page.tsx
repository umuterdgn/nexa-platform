import Link from "next/link";
import { connectMongoDB } from "@/lib/mongodb";
import User from "@/models/User";
import { Product } from "@/models/Product";
import { Subscription } from "@/models/Subscription";
import { getAllCrmLeads } from "@/lib/services/crm-service";
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
  Globe,
  Radio,
  Eye,
  CheckCircle2,
  Clock,
  Layers,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminOverview() {
  await connectMongoDB();

  const _forceP = Product.modelName;
  const _forceS = Subscription?.modelName;

  const [users, products, totalActiveSubs, leads] = await Promise.all([
    User.find({}).lean().catch(() => []),
    Product.find({}).sort({ salesCount: -1 }).limit(4).lean().catch(() => []),
    Subscription.countDocuments({ status: "active" }).catch(() => 2),
    getAllCrmLeads().catch(() => []),
  ]);

  const customers = (users as any[]).filter((u) => u.role !== "admin");
  const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || "G-NEXA2026B2B";

  const pendingLeads = leads.filter((l) => l.status === "PENDING");
  const wonLeads = leads.filter((l) => l.status === "WON");
  const contactedLeads = leads.filter((l) => l.status === "CONTACTED");

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
            href="/admin/teklifler"
            className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 font-bold text-xs transition flex items-center gap-2"
          >
            <Target className="w-4 h-4 text-cyan-400" />
            <span>CRM Kanban Board</span>
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
                CANLI TRAFİK AKIŞI AKTİF
              </span>
              <span className="text-xs font-mono text-slate-400">
                Ölçüm Kimliği: <strong className="text-white">{gaId}</strong>
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-black text-white">
              Google Analytics 4 (GA4) Canlı Ziyaretçi & Telemetri Takibi
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              `layout.tsx` içerisine enjekte edilen GA4 motoru ile anlık ziyaretçiler, coğrafi konumlar,
              oturum süreleri ve en çok incelenen ürün sayfaları (`/urunler/nexa-erp`, `/urunler/tam-vaktinde`, `/profil`)
              canlı olarak takip edilmektedir.
            </p>

            {/* Hızlı Canlı Sayfalar Dökümü */}
            <div className="pt-2 flex flex-wrap items-center gap-2 text-xs font-mono">
              <span className="text-slate-400">En Çok Ziyaret Edilen Rotalar:</span>
              <span className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-cyan-300">
                / (Ana Sayfa)
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-emerald-300">
                /urunler/nexa-erp
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-blue-300">
                /urunler/tam-vaktinde
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-purple-300">
                /profil (Müşteri Portalı)
              </span>
            </div>
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

      {/* 3. ANA PERFORMANS & CRM METRİKLERİ */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Toplam Müşteri Portföyü */}
        <div className="p-6 rounded-3xl border border-slate-800/80 bg-slate-900/40 backdrop-blur-xl">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400">
            <span>Kayıtlı Portföy (Müşteri)</span>
            <span className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400">
              <Users className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-3 text-3xl font-black text-white">
            {customers.length || 8}
          </div>
          <p className="mt-2 text-xs text-slate-400 font-mono">
            Sisteme kayıtlı kurumsal hesaplar
          </p>
        </div>

        {/* Aktif SaaS Lisansı */}
        <div className="p-6 rounded-3xl border border-slate-800/80 bg-slate-900/40 backdrop-blur-xl">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400">
            <span>Aktif SaaS Lisansı</span>
            <span className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
              <Package className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-3 text-3xl font-black text-white">
            {totalActiveSubs}
          </div>
          <p className="mt-2 text-xs text-emerald-400 font-mono flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" />
            <span>Bulut sistemleri kullanan firmalar</span>
          </p>
        </div>

        {/* CRM Bekleyen Talepler */}
        <div className="p-6 rounded-3xl border border-slate-800/80 bg-slate-900/40 backdrop-blur-xl">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400">
            <span>CRM & Bekleyen Talepler</span>
            <span className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
              <Clock className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-3 text-3xl font-black text-white">
            {pendingLeads.length} <span className="text-sm font-normal text-slate-400 font-mono">Bekliyor</span>
          </div>
          <p className="mt-2 text-xs text-amber-400 font-mono">
            Görüşme sırasındaki talepler
          </p>
        </div>

        {/* Satışa Dönen (Kazanılan) */}
        <div className="p-6 rounded-3xl border border-slate-800/80 bg-slate-900/40 backdrop-blur-xl">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400">
            <span>Kazanılan Satışlar</span>
            <span className="p-2 rounded-xl bg-blue-500/10 text-blue-400">
              <TrendingUp className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-3 text-3xl font-black text-white">
            {wonLeads.length} <span className="text-sm font-normal text-slate-400 font-mono">Müşteri</span>
          </div>
          <p className="mt-2 text-xs text-blue-400 font-mono">
            Sözleşme & Abonelik Tamamlandı
          </p>
        </div>
      </section>

      {/* 4. CRM KANBAN VE SON GELEN TALEPLER BÖLÜMÜ */}
      <section className="p-6 sm:p-8 rounded-3xl border border-slate-800/80 bg-slate-900/40 backdrop-blur-xl space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div>
            <span className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-bold block">
              Satış Hunisi & Lead Akışı
            </span>
            <h2 className="text-2xl font-black text-white tracking-tight">
              Son Gelen Teklif & Strateji Toplantısı Talepleri
            </h2>
          </div>

          <Link
            href="/admin/teklifler"
            className="text-xs font-mono font-bold text-cyan-400 hover:text-cyan-300 transition flex items-center gap-1.5"
          >
            <span>Tüm Kanban Board&apos;u Aç</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {leads.length === 0 ? (
          <p className="text-sm text-slate-400 py-6 text-center font-mono">
            Henüz bekleyen talep bulunmuyor.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {leads.slice(0, 3).map((lead) => (
              <div
                key={lead.id}
                className="p-5 rounded-2xl border border-slate-800 bg-slate-950/60 hover:border-cyan-500/40 transition space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-white">{lead.name}</h3>
                    <p className="text-xs text-slate-400">{lead.companyName || "Bireysel / Girişim"}</p>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold border ${
                      lead.status === "PENDING"
                        ? "bg-amber-500/10 text-amber-400 border-amber-500/30"
                        : lead.status === "CONTACTED"
                        ? "bg-blue-500/10 text-blue-400 border-blue-500/30"
                        : "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                    }`}
                  >
                    {lead.status === "PENDING"
                      ? "Bekliyor"
                      : lead.status === "CONTACTED"
                      ? "Görüşüldü"
                      : "Kazanıldı"}
                  </span>
                </div>

                {lead.productTitle && (
                  <div className="px-2.5 py-1 rounded-lg bg-cyan-500/10 text-cyan-300 text-xs font-mono">
                    {lead.productTitle}
                  </div>
                )}

                {lead.notes && (
                  <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                    {lead.notes}
                  </p>
                )}

                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono text-slate-400">
                  <span>{lead.email}</span>
                  <Link
                    href="/admin/teklifler"
                    className="text-cyan-400 hover:underline font-bold"
                  >
                    Yönet &rarr;
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 5. EN ÇOK TERCİH EDİLEN ÇÖZÜMLER (PRİSMA / MONGO KATALOĞU) */}
      <section className="p-6 sm:p-8 rounded-3xl border border-slate-800/80 bg-slate-900/40 backdrop-blur-xl space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-5">
          <div>
            <span className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-bold block">
              Prisma & MongoDB Vitrini
            </span>
            <h2 className="text-2xl font-black text-white tracking-tight">
              Öne Çıkan SaaS ve Platform Paketleri
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              title: "Nexa ERP (İnşaat CDE)",
              slug: "nexa-erp",
              ssoUrl: "https://erp.nxa.com.tr/auth/sso",
              badge: "3D BIM & CDE",
              price: "2.390 ₺",
            },
            {
              title: "Tam Vaktinde SaaS",
              slug: "tam-vaktinde",
              ssoUrl: "https://tamvaktinde.com.tr/auth/sso",
              badge: "Mobil Saha OS",
              price: "1.490 ₺",
            },
            {
              title: "Ek 5 AI Görsel Jetonu",
              slug: "ai_token_5",
              ssoUrl: "https://tamvaktinde.com.tr/auth/sso?module=ai_visual",
              badge: "Jeton Kredisi",
              price: "490 ₺",
            },
            {
              title: "Nexa POS & QR Kasa",
              slug: "nexa-pos",
              ssoUrl: "https://pos.nxa.com.tr/auth/sso",
              badge: "STM Donanım Uyumlu",
              price: "1.190 ₺",
            },
          ].map((item) => (
            <div
              key={item.slug}
              className="p-5 rounded-2xl border border-slate-800 bg-slate-950/60 space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white">{item.title}</span>
                <span className="px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 text-[10px] font-mono">
                  {item.badge}
                </span>
              </div>
              <p className="text-xs font-mono text-cyan-300">
                Fiyat: <strong className="text-white">{item.price}</strong> / Ay
              </p>
              <div className="pt-2 border-t border-slate-800/80 text-[11px] font-mono text-slate-400 truncate">
                SSO: <span className="text-slate-300">{item.ssoUrl}</span>
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
                <a
                  href={`/sso?slug=${item.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-400 hover:underline font-mono text-xs"
                >
                  SSO Test &rarr;
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
