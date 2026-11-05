import type { Metadata } from "next";
import Link from "next/link";
import { MainLayout } from "@/components/layout/MainLayout";
import { LeadMagnetCard } from "@/components/home/LeadMagnetCard";
import { 
  Building2, 
  TrendingDown, 
  Clock, 
  CheckCircle2, 
  ArrowRight, 
  Globe2, 
  Boxes, 
  Sparkles,
  ShieldCheck,
  Video
} from "lucide-react";

export const metadata: Metadata = {
  title: "Başarı Hikayeleri & Vaka İncelemeleri | Nexa",
  description:
    "Nexa otonom ekosistemleri ile kurumsal operasyon maliyetlerini nasıl %40 düşürdük? Gerçek veriler, şantiye optimizasyonları ve randevu dönüşüm hikayeleri.",
  alternates: {
    canonical: "https://nxa.com.tr/basari-hikayeleri",
  },
};

const CASE_STUDIES = [
  {
    title: "Atlas Global Logistics: Dağıtık Filo ve Depo Süreçlerinde %40 Operasyon Maliyeti Düşüşü",
    company: "Atlas Global Logistics",
    industry: "Uluslararası Tedarik Zinciri & Lojistik",
    icon: Globe2,
    metrics: [
      { label: "Maliyet Tasarrufu", value: "%41.5", sub: "Yıllık operasyonel harcama" },
      { label: "İşlem Hızı", value: "3.8x", sub: "Konşimento ve gümrük eşitleme" },
      { label: "Veri Hatası", value: "%0", sub: "Sıfır mükerrer kayıt" },
    ],
    summary:
      "22 farklı ülkede faaliyet gösteren Atlas Global, birbirinden kopuk 4 farklı ERP ve lokal yazılım kullanıyordu. Nexa Core API Gateway ile tüm uç noktalar birleştirildi; personel mesaisi haftada ortalama 18 saat azaldı.",
    solution: "Özel (Custom) Dağıtık Entegrasyon Gateway & React Native Saha Uygulaması",
    quote:
      "Nexa'ya geçtikten sonra manuel mutabakat süreçlerimiz tamamen otonom hale geldi. İlk 3 ay içinde yatırımımızın karşılığını fazlasıyla aldık.",
    author: "Serdar K., Operasyon Direktörü",
  },
  {
    title: "Vanguard Yapı: 14 Aktif Şantiyede Hakediş Süreçlerinde %60 Zaman Tasarrufu",
    company: "Vanguard Yapı & Taahhüt A.Ş.",
    industry: "Büyük Ölçekli Konut & Ticari İnşaat",
    icon: Building2,
    metrics: [
      { label: "Hakediş Süresi", value: "2 Gün", sub: "Eskiden 14 gün sürüyordu" },
      { label: "Stok Doğruluğu", value: "%99.8", sub: "Demir ve beton fire kontrolü" },
      { label: "Taşeron Mutabakatı", value: "Anlık", sub: "Mobil puantaj senkronizasyonu" },
    ],
    summary:
      "Şantiyelerden merkeze gelen evrakların incelenmesi ve hakediş hesaplanması haftalar alıyordu. Nexa ERP Şantiye Modülü devreye alındıktan sonra şantiye şefleri tek tıkla malzeme ve iş gücü verilerini sisteme aktarmaya başladı.",
    solution: "Nexa ERP (B2B Business & Construction Management)",
    quote:
      "Şantiyedeki demir ve beton firesini anlık olarak cep telefonumdan izleyebiliyorum. Şeffaflık ve nakit akışı kontrolümüz inanılmaz arttı.",
    author: "Mimar Caner T., Yönetim Kurulu Üyesi",
  },
  {
    title: "Zenith Retail Group: Çok Şubeli Hizmet Operasyonunda Sıfır 'No-Show' Oranı",
    company: "Zenith Retail & Estetik Zinciri",
    industry: "Çok Şubeli Sağlık ve Hizmet Sektörü",
    icon: Boxes,
    metrics: [
      { label: "Randevu Kaçırma", value: "%0.4", sub: "Eskiden %26 seviyesindeydi" },
      { label: "Kapasite Artışı", value: "+%68", sub: "Otomatik slot doldurma" },
      { label: "Tahsilat Hızı", value: "Anlık", sub: "PayTR online ön ödeme" },
    ],
    summary:
      "Günde yüzlerce randevu alan 12 şubeli sağlık zincirinde müşterilerin randevuya gelmemesi (no-show) yıllık milyonlarca lira gelir kaybına yol açıyordu. Tam Vaktinde SaaS altyapısı ile akıllı WhatsApp teyit akışı kuruldu.",
    solution: "Tam Vaktinde (B2B2C Marketplace & Appointment SaaS)",
    quote:
      "WhatsApp hatırlatıcıları sayesinde randevuya gelmeme oranımız neredeyse sıfıra indi. Gelirlerimizde ilk aydan itibaren %35 sıçrama yaşadık.",
    author: "Dr. Elif M., Kurucu Ortak",
  },
];

export default function BasariHikayeleriPage() {
  return (
    <MainLayout>
      <div className="relative min-h-screen bg-zinc-950 text-foreground selection:bg-emerald-500/30 selection:text-emerald-300 py-16 sm:py-24">
        {/* Background Ambient Glow */}
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute top-20 left-1/2 -translate-x-1/2 h-[500px] w-[800px] bg-gradient-to-b from-emerald-500/10 via-blue-500/5 to-transparent blur-[160px]" />
        </div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-1 text-xs font-mono font-medium text-emerald-400">
              <Sparkles className="h-3.5 w-3.5" />
              Kanıtlanmış Veriler & Sonuçlar
            </div>
            <h1 className="mt-4 font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
              Operasyonel Maliyetleri{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-cyan-300 to-blue-400">
                Nasıl %40 Düşürdük?
              </span>
            </h1>
            <p className="mt-4 text-base sm:text-lg text-zinc-300 leading-relaxed">
              Masaüstü ezberlerini bozan, şirketleri hantal bürokrasiden kurtaran ve doğrudan kârlılığa yansıyan gerçek B2B dönüşüm vakaları.
            </p>
          </div>

          {/* Case Studies Cards */}
          <div className="space-y-12">
            {CASE_STUDIES.map((cs, idx) => {
              const Icon = cs.icon;
              return (
                <div
                  key={idx}
                  className="rounded-3xl border border-white/10 bg-zinc-900/40 p-8 sm:p-12 backdrop-blur-xl relative overflow-hidden"
                >
                  <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-white/[0.08]">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <span className="font-display text-lg font-bold text-white">{cs.company}</span>
                        <p className="text-xs text-zinc-400">{cs.industry}</p>
                      </div>
                    </div>

                    <div className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 font-mono text-xs font-semibold text-emerald-300">
                      Çözüm: {cs.solution}
                    </div>
                  </div>

                  {/* Title & Summary */}
                  <div className="mt-6">
                    <h2 className="font-display text-2xl sm:text-3xl font-bold text-white">
                      {cs.title}
                    </h2>
                    <p className="mt-3 text-sm sm:text-base text-zinc-300 leading-relaxed max-w-4xl">
                      {cs.summary}
                    </p>
                  </div>

                  {/* Metrics Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-8">
                    {cs.metrics.map((m, mIdx) => (
                      <div
                        key={mIdx}
                        className="rounded-2xl border border-white/[0.06] bg-zinc-950/70 p-5"
                      >
                        <div className="text-xs font-mono uppercase text-zinc-400">{m.label}</div>
                        <div className="mt-1 font-mono text-3xl sm:text-4xl font-extrabold text-emerald-400">
                          {m.value}
                        </div>
                        <div className="mt-1 text-xs text-zinc-400">{m.sub}</div>
                      </div>
                    ))}
                  </div>

                  {/* Quote */}
                  <blockquote className="rounded-xl border-l-2 border-emerald-400 bg-zinc-950/60 p-4 sm:p-5 italic text-sm text-zinc-300">
                    "{cs.quote}"
                    <span className="block mt-2 font-mono text-xs font-semibold not-italic text-emerald-400">
                      — {cs.author}
                    </span>
                  </blockquote>
                </div>
              );
            })}
          </div>

          {/* Lead Magnet: B2B Digitalization PDF Report */}
          <LeadMagnetCard
            source="Case_Studies_Page"
            title="42 Sayfalık 2026 B2B Dijitalleşme & Verimlilik Raporu"
            subtitle="Atlas Global ve Vanguard Yapı gibi devlerin operasyon maliyetlerini düşüren kurumsal mimari ve entegrasyon formülleri e-posta adresinizde."
          />

          {/* Bottom Conversion Section */}
          <div className="mt-20 rounded-3xl border border-white/10 bg-gradient-to-r from-zinc-900/80 via-zinc-900/40 to-zinc-950 p-8 sm:p-12 text-center backdrop-blur-2xl">
            <h3 className="font-display text-2xl sm:text-4xl font-bold text-white">
              Sıradaki Başarı Hikayesi Sizin İşletmeniz Olsun
            </h3>
            <p className="mt-3 text-sm sm:text-base text-zinc-300 max-w-2xl mx-auto">
              Kurucu & Baş Yazılım Mühendisi Umut Erdoğan ile 30 dakikalık Google Meet strateji seansı planlayın.
            </p>
            <div className="mt-8 flex justify-center">
              <Link
                href="/teklif-al"
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-green-400 px-8 py-4 text-sm font-bold text-zinc-950 shadow-[0_0_25px_rgba(16,185,129,0.4)] hover:scale-[1.02] active:scale-95 transition-all"
              >
                <span>Projenizi 48 Saatte Planlayalım</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
