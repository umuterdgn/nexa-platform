import React from "react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import {
  ShieldCheck,
  Zap,
  Cpu,
  Layers,
  ArrowRight,
  Server,
  Lock,
  WifiOff,
  Boxes,
  Radio,
  Building2,
  CheckCircle2,
} from "lucide-react";
import { getProductBySlug } from "@/lib/services/product-service";
import { ProductPricingCheckout } from "./ProductPricingCheckout";

interface PageProps {
  params: Promise<{ slug: string }>;
}

/**
 * Dinamik SEO ve Metadata Üretimi (Next.js 16 Standartları)
 */
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return {
      title: "Ürün Bulunamadı | Nexa Kurumsal Mühendislik",
      description: "Aradığınız B2B SaaS ürünü bulunamadı.",
    };
  }

  return {
    title: `${product.title} - Fiyatlandırma & SaaS Paketleri | Nexa Platform`,
    description: product.description.slice(0, 160),
    openGraph: {
      title: `${product.title} - Kurumsal B2B Bulut & CDE Çözümü`,
      description: product.description,
      type: "website",
    },
  };
}

/**
 * Dinamik B2B SaaS Ürün Detay & Satış Sayfası
 * nxa.com.tr/urunler/[slug] (Örn: /urunler/nexa-erp, /urunler/tam-vaktinde)
 */
export default async function ProductDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  // Ürüne Özel SoftwareApplication JSON-LD Şeması (GEO/SEO Otorite Yapısı)
  const productSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "@id": `https://nxa.com.tr/urunler/${product.slug}#software`,
    name: product.title,
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web, iOS, Android, Cloud, PWA",
    description: product.description,
    url: `https://nxa.com.tr/urunler/${product.slug}`,
    offers: product.plans.map((plan) => ({
      "@type": "Offer",
      name: plan.name,
      price: plan.yearlyPrice,
      priceCurrency: plan.currency,
      availability: "https://schema.org/InStock",
    })),
    publisher: {
      "@type": "Organization",
      name: "Nexa",
      url: "https://nxa.com.tr",
    },
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* SoftwareApplication Schema Injection */}
      <script
        id={`product-schema-${product.slug}`}
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />

      {/* Arka Plan Elektrik Mavisi & Koyu Mavi Glow Efektleri */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[550px] overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-[-20%] left-[20%] w-[550px] h-[550px] bg-cyan-600/15 rounded-full blur-[130px]" />
        <div className="absolute top-[-10%] right-[20%] w-[500px] h-[500px] bg-blue-600/15 rounded-full blur-[150px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20">
        {/* Üst Navigasyon / Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-slate-400 mb-8 font-mono">
          <Link href="/" className="hover:text-cyan-300 transition">
            Ana Sayfa
          </Link>
          <span>/</span>
          <Link href="/#cozumler" className="hover:text-cyan-300 transition">
            Ürünler
          </Link>
          <span>/</span>
          <span className="text-cyan-400 font-semibold">{product.title}</span>
        </nav>

        {/* HERO SECTION */}
        <section className="relative pb-16 border-b border-slate-800/80">
          <div className="max-w-4xl">
            <div className="flex flex-wrap items-center gap-3 mb-5">
              <span className="px-3.5 py-1 text-xs font-bold tracking-wider uppercase rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                {product.category === "SAAS" ? "Bulut CDE & SaaS" : "Özel Mühendislik"}
              </span>
              {product.badge && (
                <span className="px-3.5 py-1 text-xs font-bold tracking-wider uppercase rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  {product.badge}
                </span>
              )}
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.1]">
              {product.title}
            </h1>

            <p className="mt-4 text-xl sm:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-blue-300 to-white">
              {product.tagline}
            </p>

            <p className="mt-6 text-base sm:text-lg text-slate-300 leading-relaxed max-w-3xl font-sans">
              {product.description}
            </p>

            {/* Hızlı Butonlar */}
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <a
                href="#fiyatlandirma"
                className="px-7 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-sm shadow-lg shadow-cyan-500/25 transition flex items-center gap-2"
              >
                <span>Paketleri & Fiyatları İncele</span>
                <ArrowRight className="w-4 h-4" />
              </a>
              <Link
                href="/teklif-al"
                className="px-7 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 font-semibold text-sm transition"
              >
                Özel Şantiye Demosu Planla
              </Link>
            </div>

            {/* Metrikler (SaaS / Şantiye KPIs) */}
            {product.heroMetrics && (
              <div className="mt-12 grid grid-cols-2 sm:grid-cols-3 gap-6 pt-8 border-t border-slate-900">
                {product.heroMetrics.map((metric, idx) => (
                  <div key={idx}>
                    <div className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                      {metric.value}
                    </div>
                    <div className="text-xs sm:text-sm text-cyan-400 mt-1 font-mono">
                      {metric.label}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* MODÜLER ÖZELLİKLER & B2B TEKNİK MİMARİ */}
        <section className="py-16 border-b border-slate-800/80">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-xs font-mono font-semibold uppercase tracking-wider text-cyan-400">
              Teknik Altyapı ve Saha Uyumluluğu
            </span>
            <h2 className="text-3xl font-extrabold text-white mt-2">
              Saha ve Yönetim Arasında Sıfır Hata Köprüsü
            </h2>
            <p className="text-sm text-slate-400 mt-2">
              İnşaat ortak veri ortamı (CDE - ISO 19650), Dexie.js çevrimdışı önbellekleme
              ve 5D BIM model entegrasyonuyla donatılmıştır.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {product.features.map((feature, idx) => (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800/90 hover:border-cyan-500/40 transition-all duration-300"
              >
                <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center mb-4">
                  {idx === 0 ? (
                    <WifiOff className="w-5 h-5" />
                  ) : idx === 1 ? (
                    <Boxes className="w-5 h-5 text-emerald-400" />
                  ) : idx === 2 ? (
                    <Radio className="w-5 h-5" />
                  ) : (
                    <Layers className="w-5 h-5" />
                  )}
                </div>
                <h3 className="text-base font-bold text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>

          {/* Semantik Teknik Kıyaslama Tablosu */}
          <div className="mt-12 overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/40">
            <div className="p-4 bg-slate-900/90 border-b border-slate-800">
              <h3 className="text-sm font-mono font-bold text-white uppercase tracking-wider">
                {product.title} &bull; Kurumsal Teknik Yetkinlik Matrisi
              </h3>
            </div>
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950 text-slate-400 font-mono text-[11px] uppercase tracking-wider border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4 font-semibold">Özellik / Modül</th>
                  <th className="py-3 px-4 font-semibold">Destek Seviyesi</th>
                  <th className="py-3 px-4 font-semibold">Teknik Açıklama ve Uyumluluk</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {product.features.map((feature, idx) => (
                  <tr key={idx} className="hover:bg-slate-800/30">
                    <td className="py-3 px-4 font-semibold text-white">{feature.title}</td>
                    <td className="py-3 px-4 text-cyan-400 font-mono font-bold">Aktif / Tam Uyum</td>
                    <td className="py-3 px-4 text-slate-400">{feature.description}</td>
                  </tr>
                ))}
                <tr className="hover:bg-slate-800/30">
                  <td className="py-3 px-4 font-semibold text-white">Veritabanı & Altyapı İzolasyonu</td>
                  <td className="py-3 px-4 text-emerald-400 font-mono font-bold">NeonDB Dedicated</td>
                  <td className="py-3 px-4 text-slate-400">Her kurumsal müşteri için bağımsız PostgreSQL şeması ve anlık veri tabanı klonlama.</td>
                </tr>
                <tr className="hover:bg-slate-800/30">
                  <td className="py-3 px-4 font-semibold text-white">ERP & Muhasebe Entegrasyonu</td>
                  <td className="py-3 px-4 text-blue-400 font-mono font-bold">SAP, Logo, OData REST</td>
                  <td className="py-3 px-4 text-slate-400">Merkez finans, e-Fatura ve muhasebe sistemleriyle iki yönlü otomatik mutabakat.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* SAAS PAKETLERİ, PRICING TABLE VE CHECKOUT SEPET BİLEŞENİ */}
        <ProductPricingCheckout product={product} />

        {/* TEKNİK GÜVENLİK VE PROVISIONING BİLGİLENDİRME BANNERI */}
        <section className="mt-20 p-8 sm:p-10 rounded-3xl bg-gradient-to-r from-slate-900 via-blue-950/40 to-slate-900 border border-cyan-500/20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-cyan-500/10 border border-cyan-500/20 rounded-2xl text-cyan-400 shrink-0">
                <Server className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">
                  İzole NeonDB Mimarisi
                </h4>
                <p className="text-xs text-slate-400 mt-1">
                  Her firma için bağımsız şifrelenmiş PostgreSQL veri tabanı alanı
                  ve özel subdomain tahsis edilir.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-2xl text-blue-400 shrink-0">
                <Lock className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">
                  ISO 27001 & KVKK Uyumlu
                </h4>
                <p className="text-xs text-slate-400 mt-1">
                  Uçtan uca TLS 1.3 şifreleme ve Türkiye lokasyonlu Tier-3 veri
                  merkezlerinde güvenli barındırma.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-emerald-400 shrink-0">
                <Zap className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">
                  Anında Otomatik Aktivasyon
                </h4>
                <p className="text-xs text-slate-400 mt-1">
                  PayTR / İyzico webhook tetikleyicisi ile ödemeden hemen sonra
                  şirket tenant&apos;ınız oluşturulur.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
