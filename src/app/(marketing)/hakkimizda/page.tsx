import Link from "next/link";
import { Target, Users, Award, ArrowRight } from "lucide-react";

const values = [
  {
    icon: Target,
    title: "Misyonumuz",
    description:
      "KOBİ'lerden kurumsal firmalara kadar her ölçekteki işletmenin dijital dönüşümünü hızlandırmak. SaaS ve ajans hizmetlerini tek platformda birleştirerek erişilebilir kılmak.",
  },
  {
    icon: Users,
    title: "Ekibimiz",
    description:
      "Yazılım mühendisleri, UX tasarımcıları ve dijital pazarlama uzmanlarından oluşan multidisipliner bir ekip. İskenderun merkezli, Türkiye geneline hizmet veriyoruz.",
  },
  {
    icon: Award,
    title: "Değerlerimiz",
    description:
      "Şeffaflık, güvenilirlik ve müşteri odaklılık temel prensiplerimizdir. Her projede ölçülebilir sonuçlar ve uzun vadeli ortaklıklar hedefliyoruz.",
  },
];

const stats = [
  { value: "50+", label: "Aktif Müşteri" },
  { value: "12", label: "SaaS Ürünü" },
  { value: "7/24", label: "Destek" },
  { value: "99.9%", label: "Uptime" },
];

export default function HakkimizdaPage() {
  return (
    <div className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(139,92,246,0.1),transparent_55%)]" />

      <section className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:py-32">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-nexa-electric-bright">
            Hakkımızda
          </p>
          <h1 className="mt-4 font-display text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Dijital dönüşümün{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-nexa-electric-bright to-purple-400">
              güvenilir ortağı
            </span>
          </h1>
          <p className="mt-6 text-lg text-slate-400 leading-relaxed">
            Nexa Platform, 2024 yılında kurulmuş; SaaS yazılım geliştirme ve dijital
            ajans hizmetlerini bir araya getiren yenilikçi bir teknoloji şirketidir.
            Amacımız, işletmelerin teknoloji yükünü hafifletmek ve büyümelerine odaklanmalarını sağlamaktır.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-2 gap-6 sm:grid-cols-4">
          {stats.map(({ value, label }) => (
            <div
              key={label}
              className="rounded-2xl border border-white/10 bg-nexa-anthracite/30 p-6 text-center"
            >
              <div className="font-display text-3xl font-bold text-nexa-electric-bright">
                {value}
              </div>
              <div className="mt-1 text-sm text-slate-400">{label}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="border-t border-white/5 bg-nexa-anthracite/20 py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid gap-8 lg:grid-cols-3">
            {values.map(({ icon: Icon, title, description }) => (
              <div
                key={title}
                className="rounded-2xl border border-white/10 bg-black/40 p-8"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-500/15 text-purple-400">
                  <Icon size={20} />
                </div>
                <h2 className="mt-5 font-display text-xl font-semibold text-white">
                  {title}
                </h2>
                <p className="mt-3 text-sm text-slate-400 leading-relaxed">
                  {description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
          <h2 className="font-display text-2xl font-bold text-white sm:text-3xl">
            Birlikte büyüyelim
          </h2>
          <p className="mt-4 text-slate-400">
            Ürünlerimizi keşfedin veya ajans hizmetlerimiz hakkında bilgi alın.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/urunler"
              className="inline-flex items-center gap-2 rounded-xl bg-nexa-electric px-6 py-3 text-sm font-semibold text-white transition hover:bg-nexa-electric-bright"
            >
              SaaS Ürünleri
              <ArrowRight size={14} />
            </Link>
            <Link
              href="/hizmetler"
              className="inline-flex items-center gap-2 rounded-xl border border-white/15 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/5"
            >
              Ajans Hizmetleri
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
