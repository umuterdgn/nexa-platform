import Link from "next/link";
import { ArrowRight, Sparkles, Zap, Shield, Globe } from "lucide-react";

export const dynamic = "force-dynamic";

const features = [
  {
    icon: Zap,
    title: "Hızlı Kurulum",
    description:
      "SaaS ürünlerinizi dakikalar içinde aktif edin, hemen kullanmaya başlayın.",
  },
  {
    icon: Shield,
    title: "Güvenli Altyapı",
    description:
      "256-bit SSL, PayTR entegrasyonu ve çok kiracılı izolasyon ile verileriniz güvende.",
  },
  {
    icon: Globe,
    title: "Ajans + SaaS",
    description:
      "Yazılım paketlerinden kurumsal hizmetlere — tek platformda tüm dijital ihtiyaçlarınız.",
  },
];

export default function HomePage() {
  return (
    <div className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(29,78,216,0.15),transparent_60%)]" />

      {/* Hero */}
      <section className="relative mx-auto max-w-7xl px-4 py-28 sm:px-6 lg:py-36">
        <div className="mx-auto max-w-4xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-nexa-electric/30 bg-nexa-electric/10 px-4 py-1.5 text-xs font-medium text-nexa-electric-bright">
            <Sparkles size={14} />
            nxa.com.tr — Dijital Dönüşüm Platformu
          </div>

          <h1 className="mt-8 font-display text-5xl font-bold tracking-tight text-white sm:text-6xl lg:text-7xl">
            İşinizi{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-nexa-electric-bright via-blue-400 to-purple-400">
              geleceğe taşıyın
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-400 leading-relaxed">
            Nexa; SaaS yazılımları, ajans hizmetleri ve kurumsal çözümleri tek
            çatı altında sunan modern bir dijital platformdur. Ölçeklenebilir,
            güvenli ve kullanıma hazır.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/urunler"
              className="inline-flex items-center gap-2 rounded-xl bg-nexa-electric px-8 py-3.5 text-sm font-semibold text-white shadow-neon-sm transition hover:bg-nexa-electric-bright active:scale-[0.98]"
            >
              Ürünleri Keşfet
              <ArrowRight size={16} />
            </Link>
            <Link
              href="/hizmetler"
              className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-8 py-3.5 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              Hizmetlerimiz
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="relative border-t border-white/5 bg-nexa-anthracite/20 py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="text-center mb-16">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-nexa-electric-bright">
              Neden Nexa?
            </p>
            <h2 className="mt-3 font-display text-3xl font-bold text-white sm:text-4xl">
              Tek platform, sınırsız imkan
            </h2>
          </div>

          <div className="grid gap-8 sm:grid-cols-3">
            {features.map(({ icon: Icon, title, description }) => (
              <div
                key={title}
                className="rounded-2xl border border-white/10 bg-black/40 p-8 transition hover:border-nexa-electric/30"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-nexa-electric/15 text-nexa-electric-bright">
                  <Icon size={22} />
                </div>
                <h3 className="mt-5 font-display text-lg font-semibold text-white">
                  {title}
                </h3>
                <p className="mt-2 text-sm text-slate-400 leading-relaxed">
                  {description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */} 
      <section className="relative py-24">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
          <h2 className="font-display text-3xl font-bold text-white">
            Hemen başlamaya hazır mısınız?
          </h2>
          <p className="mt-4 text-slate-400">
            Kayıt olun, ürünlerinizi seçin ve birkaç dakika içinde aktif edin.
          </p>
          <Link
            href="/auth/register"
            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-nexa-electric px-8 py-3.5 text-sm font-semibold text-white shadow-neon-sm transition hover:bg-nexa-electric-bright"
          >
            Ücretsiz Kayıt Ol
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </div>
  );
}
