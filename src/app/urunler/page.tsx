import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import {
  Layers,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  Zap,
  Building2,
  Boxes,
  Cpu,
  ShoppingBag,
  Truck,
  ExternalLink,
} from "lucide-react";
import { getAllProducts } from "@/lib/services/product-service";
import { openStrategyCallModal } from "@/lib/modal-events";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "B2B SaaS ve Kurumsal Yazılım Ürünleri | Nexa Global",
  description:
    "İnşaat ve şantiye ERP (Nexa ERP), çoklu mağaza rollout OS (Nexa Franchise), hibrit bulut POS ve kuruma özel yazılım çözümleri. Prisma veritabanından dinamik olarak listelenir.",
  alternates: {
    canonical: "https://nxa.com.tr/urunler",
  },
};

export default async function UrunlerPage() {
  const products = await getAllProducts();

  // JSON-LD ItemList Şeması (GEO/SEO)
  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "Nexa Global B2B SaaS ve Kurumsal Ürünler",
    "itemListElement": products.map((prod, idx) => ({
      "@type": "ListItem",
      "position": idx + 1,
      "name": prod.title,
      "url": `https://nxa.com.tr/urunler/${prod.slug}`,
      "description": prod.description,
    })),
  };

  return (
    <div className="relative min-h-screen bg-slate-950 text-slate-100 selection:bg-cyan-500/30 selection:text-cyan-200 pt-28 pb-24 px-4 sm:px-6 lg:px-8">
      {/* JSON-LD Yapısal Veri */}
      <script
        id="products-itemlist-schema"
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />

      {/* Deep-Tech Ambient Glow Efektleri */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-1/2 -translate-x-1/2 h-[500px] w-[800px] rounded-full bg-cyan-600/10 blur-[140px]" />
        <div className="absolute top-1/2 right-10 h-[400px] w-[500px] rounded-full bg-blue-600/10 blur-[130px]" />
      </div>

      <div className="relative mx-auto max-w-7xl">
        {/* Başlık ve Tanıtım */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3.5 py-1 text-xs font-mono font-medium text-cyan-400 mb-4">
            <Sparkles className="h-3.5 w-3.5" />
            Prisma Veritabanı &bull; Canlı SaaS Vitrini
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
            İşinizi Büyüten{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-300 to-indigo-300">
              Otonom B2B Ürünleri
            </span>
          </h1>

          <p className="mt-5 text-sm sm:text-base text-slate-300 leading-relaxed">
            %100 çevrimdışı 3D BIM şantiye ERP&apos;sinden çoklu mağaza rollout sistemlerine, hibrit bulut POS ve kuruma özel SAP/OData entegre mimarilere kadar uçtan uca kurumsal teknoloji.
          </p>
        </div>

        {/* Bento Grid Vitrini */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product, idx) => {
            const isLarge = idx === 0 || idx === 1;
            const basicPlan = product.plans.find((p) => p.tier === "BASIC") || product.plans[0];
            const startingPrice = basicPlan?.yearlyPrice || basicPlan?.monthlyPrice;

            return (
              <div
                key={product.id || product.slug}
                className={`group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-slate-800/90 bg-gradient-to-b from-slate-900/80 via-slate-900/40 to-slate-950 p-6 sm:p-8 backdrop-blur-xl transition-all duration-300 hover:border-cyan-500/40 hover:shadow-2xl hover:shadow-cyan-500/10 ${
                  isLarge ? "lg:col-span-2" : "col-span-1"
                }`}
              >
                {/* Glow Accent on Hover */}
                <div className="pointer-events-none absolute -top-24 right-0 h-48 w-48 rounded-full bg-cyan-500/10 blur-[60px] group-hover:bg-cyan-500/20 transition-all" />

                <div>
                  {/* Badge & Category */}
                  <div className="flex items-center justify-between gap-3 mb-4">
                    <span className="rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-1 text-[11px] font-mono font-semibold text-cyan-300">
                      {product.badge || (product.category === "SAAS" ? "B2B SaaS Çözümü" : "Özel Mimari")}
                    </span>

                    {product.ssoUrl && (
                      <span className="flex items-center gap-1 text-[10px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        SSO Paneli Aktif
                      </span>
                    )}
                  </div>

                  {/* Title & Tagline */}
                  <h2 className="text-xl sm:text-2xl font-bold text-white group-hover:text-cyan-300 transition-colors">
                    {product.title}
                  </h2>

                  {product.tagline && (
                    <p className="mt-1.5 text-xs font-mono text-cyan-400/90 line-clamp-1">
                      {product.tagline}
                    </p>
                  )}

                  <p className="mt-3 text-xs sm:text-sm text-slate-300 leading-relaxed line-clamp-3">
                    {product.description}
                  </p>

                  {/* Features List */}
                  {product.features && product.features.length > 0 && (
                    <ul className="mt-5 space-y-2 border-t border-slate-800/80 pt-4">
                      {product.features.slice(0, isLarge ? 4 : 3).map((feat, fIdx) => (
                        <li key={fIdx} className="flex items-start gap-2 text-xs text-slate-300">
                          <CheckCircle2 className="h-3.5 w-3.5 text-cyan-400 mt-0.5 shrink-0" />
                          <span className="line-clamp-1">{feat.title}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                {/* Footer Area: Price & Action Buttons */}
                <div className="mt-8 pt-5 border-t border-slate-800/80 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <span className="block text-[11px] font-mono text-slate-400">
                      Başlangıç Fiyatı (Yıllık)
                    </span>
                    <div className="flex items-baseline gap-1">
                      <span className="text-2xl font-black text-white">
                        {startingPrice ? `${startingPrice.toLocaleString("tr-TR")} ₺` : "Teklif Usulü"}
                      </span>
                      {startingPrice && (
                        <span className="text-xs text-slate-400 font-mono">/ ay</span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Link
                      href={`/urunler/${product.slug}`}
                      className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-cyan-500/20 transition-all hover:from-cyan-400 hover:to-blue-500 active:scale-95"
                    >
                      <span>Paketleri İncele & Satın Al</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Kurumsal Mimari & Terzi İşi Danışmanlık Çağrısı */}
        <div className="mt-16 rounded-3xl border border-slate-800 bg-slate-900/60 p-8 sm:p-12 text-center backdrop-blur-xl">
          <h3 className="text-xl sm:text-3xl font-extrabold text-white">
            İşletmenize Özel Terzi İşi Mimari Mi Gerekiyor?
          </h3>
          <p className="mt-3 text-xs sm:text-sm text-slate-300 max-w-2xl mx-auto">
            Mevcut ERP, SAP veya şirket içi sunucularınızla tam entegre, özel donanım ve IoT destekli enterprise çözümler için mühendislik ekibimizle görüşün.
          </p>
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/randevu"
              className="inline-flex items-center gap-2 rounded-xl bg-slate-800 border border-slate-700 px-5 py-3 text-xs font-bold text-slate-200 hover:bg-slate-700 transition"
            >
              <span>Baş Mühendis ile Strateji Toplantısı Planla</span>
              <ExternalLink className="h-3.5 w-3.5 text-cyan-400" />
            </Link>
            <Link
              href="/teklif-al"
              className="inline-flex items-center gap-2 rounded-xl border border-cyan-500/40 bg-cyan-500/10 px-5 py-3 text-xs font-bold text-cyan-300 hover:bg-cyan-500/20 transition"
            >
              <span>48 Saatte Fiyat & Mimari Teklifi İste</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

