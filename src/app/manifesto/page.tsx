import type { Metadata } from "next";
import Link from "next/link";
import { MainLayout } from "@/components/layout/MainLayout";
import { ArrowLeft, Sparkles, Terminal, Award, Compass, Cpu, CheckCircle2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Nexa Mühendislik Manifestosu | Umut Erdoğan",
  description:
    "Yazılım sadece kod satırlarından ibaret değildir; bir işletmenin otonom sinir sistemidir. Hatay ve İskenderun köklerinden, TEKNOFEST inovasyonlarından küresel B2B SaaS mimarisine uzanan Nexa mühendislik felsefesi.",
  alternates: {
    canonical: "https://nxa.com.tr/manifesto",
  },
  openGraph: {
    title: "Nexa Mühendislik Manifestosu | Umut Erdoğan",
    description:
      "Hatay ve İskenderun köklerinden, TEKNOFEST inovasyonlarından küresel B2B SaaS mimarisine uzanan Nexa mühendislik kültürü.",
    url: "https://nxa.com.tr/manifesto",
    type: "article",
  },
};

// Strict GEO & SEO Schemas: Article & ProfilePage
const manifestoArticleSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Article",
      "@id": "https://nxa.com.tr/manifesto#article",
      "isPartOf": {
        "@type": "WebPage",
        "@id": "https://nxa.com.tr/manifesto",
      },
      "headline": "Nexa Mühendislik Kültürü & Kurucu Manifestosu: Otonom İşletmeler Çağı",
      "description":
        "Hatay/İskenderun köklerinden ve TEKNOFEST inovasyon disiplininden doğan, işletmelerin operasyonel maliyetlerini %40 düşüren Nexa mühendislik kültürü.",
      "inLanguage": "tr-TR",
      "mainEntityOfPage": "https://nxa.com.tr/manifesto",
      "datePublished": "2026-01-15T09:00:00+03:00",
      "dateModified": "2026-10-19T12:00:00+03:00",
      "author": {
        "@type": "Person",
        "@id": "https://nxa.com.tr/#founder",
        "name": "Umut Erdoğan",
        "jobTitle": "Founder & Lead Software Engineer",
        "alumniOf": {
          "@type": "CollegeOrUniversity",
          "name": "İskenderun Teknik Üniversitesi",
        },
        "knowsAbout": [
          "Full-Stack Development",
          "SaaS Architecture",
          "Distributed Systems",
          "Enterprise Resource Planning",
          "Autonomous Software Architecture",
        ],
      },
      "publisher": {
        "@type": "Organization",
        "@id": "https://nxa.com.tr/#organization",
        "name": "Nexa",
        "url": "https://nxa.com.tr",
        "logo": "https://nxa.com.tr/logo.png",
      },
    },
    {
      "@type": "ProfilePage",
      "@id": "https://nxa.com.tr/manifesto#profile",
      "mainEntity": {
        "@type": "Person",
        "@id": "https://nxa.com.tr/#founder",
        "name": "Umut Erdoğan",
        "jobTitle": "Founder & Lead Software Engineer",
        "description":
          "Nexa kurucusu ve baş yazılım mühendisi. İskenderun Teknik Üniversitesi mezunu, TEKNOFEST dereceli yazılım mimarı. B2B SaaS ve otonom kurumsal mimariler inşa eder.",
        "url": "https://nxa.com.tr",
        "alumniOf": "İskenderun Teknik Üniversitesi",
        "sameAs": [
          "https://github.com/umuterdogan",
          "https://linkedin.com/in/umuterdogan",
        ],
      },
    },
  ],
};

export default function ManifestoPage() {
  return (
    <MainLayout>
      {/* GEO Structured Data Injection */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(manifestoArticleSchema) }}
      />

      <article className="relative min-h-screen bg-zinc-950 text-zinc-400 selection:bg-emerald-500/30 selection:text-emerald-300 py-16 sm:py-24">
        {/* Subtle Ambient Glow */}
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute top-20 left-1/2 -translate-x-1/2 h-[500px] w-[700px] bg-gradient-to-b from-emerald-500/10 via-blue-500/5 to-transparent blur-[140px]" />
        </div>

        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb / Back Navigation */}
          <div className="mb-10">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-zinc-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Nexa Ana Sayfaya Dön</span>
            </Link>
          </div>

          {/* Document Header */}
          <header className="border-b border-white/[0.08] pb-12">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-1 text-xs font-mono font-medium text-emerald-400">
              <Sparkles className="h-3.5 w-3.5" />
              Nexa Engineering Culture &bull; Manifesto
            </div>

            <h1 className="mt-6 font-display text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.12]">
              Sıradan Yazılımları Reddediyoruz:{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-cyan-300 to-blue-400">
                Otonom İşletmeler Çağı
              </span>
            </h1>

            <div className="mt-8 flex flex-wrap items-center justify-between gap-4 text-xs font-mono text-zinc-400 pt-6 border-t border-white/[0.06]">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold">
                  UE
                </div>
                <div>
                  <span className="font-semibold text-white">Umut Erdoğan</span>
                  <p className="text-[11px] text-zinc-400">Founder & Lead Software Engineer</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <span>Hatay / İskenderun &bull; Global Cloud</span>
                <span>4 dk okuma süresi</span>
              </div>
            </div>
          </header>

          {/* Editorial Content */}
          <div className="mt-12 space-y-10 text-base sm:text-lg leading-relaxed text-zinc-300 font-sans">
            {/* Quote Callout */}
            <blockquote className="rounded-2xl border-l-4 border-emerald-400 bg-zinc-900/50 p-6 sm:p-8 backdrop-blur-md">
              <p className="font-display text-xl sm:text-2xl font-bold text-white italic leading-snug">
                "Yazılım sadece sunucuda çalışan kod satırlarından ibaret değildir; bir işletmenin otonom sinir sistemidir. Eğer bir yazılım işletmenizin operasyon maliyetlerini düşürmüyor ve personelinizi rutin angaryalardan kurtarmıyorsa, o yazılım değil, dijital bir yüktür."
              </p>
            </blockquote>

            {/* Section I */}
            <section className="space-y-4">
              <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-white">
                I. Hantal Sistemlerin ve "Vendor Lock-in" Cehenneminin Sonu
              </h2>
              <p>
                Son yirmi yıldır kurumsal yazılım pazarı, şirketleri hantal ve pahalı lisanslara mahkum eden eski nesil masaüstü ERP devleri tarafından kilitlendi. Şirketler, iş akışlarını yazılıma uydurmak zorunda bırakıldı; tersi olması gerekirken.
              </p>
              <p>
                Sonuç? Yüz binlerce liralık danışmanlık faturaları, çalışanların saatlerce Excel tabloları arasında veri kopyalaması, güncellenmeyen şantiyeler, çakışan randevular ve kaybolan kurumsal hafıza.
              </p>
              <p className="text-white font-medium">
                Nexa'yı bu kısır döngüyü yıkmak için kurduk. Biz, işletmeleri karmaşık arayüzlere değil; otonom, anlık konuşabilen ve gereksiz katmanları yok eden modern mikroservislere kavuşturuyoruz.
              </p>
            </section>

            {/* Section II */}
            <section className="space-y-4 pt-4 border-t border-white/[0.06]">
              <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-emerald-400">
                <Compass className="h-4 w-4" />
                Mühendislik Köklerimiz
              </div>
              <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-white">
                II. Hatay, İskenderun Teknik Üniversitesi ve TEKNOFEST Disiplini
              </h2>
              <p>
                Bizim mühendislik reflekslerimiz klimalı steril ofislerde değil; Türkiye'nin en rekabetçi teknoloji sahalarında, <strong className="text-white">İskenderun Teknik Üniversitesi</strong> amfilerinde ve <strong className="text-white">TEKNOFEST</strong>'in sıfır hata toleranslı yarışma pistlerinde şekillendi.
              </p>
              <p>
                O sahalarda öğrendiğimiz en temel ilke şuydu: <em>"Kriz anında çöken bir algoritma, hiç yazılmamış sayılır."</em> İletişimin koptuğu, kaynakların kısıtlı olduğu en zorlu anlarda çalışan sistemler inşa etme tecrübesi; bugün Nexa ERP'nin şantiye veri senkronizasyonunda, Tam Vaktinde'nin yüksek trafikli randevu altyapısında ve NexaEdu'nun akıllı analiz modüllerinde yaşıyor.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-6">
                <div className="rounded-xl border border-white/[0.08] bg-zinc-900/60 p-4">
                  <Award className="h-5 w-5 text-emerald-400 mb-2" />
                  <div className="text-xs font-bold text-white">TEKNOFEST Refleksi</div>
                  <p className="text-[11px] text-zinc-400 mt-1">Yüksek stres ve canlı veri altında kusursuz mimari</p>
                </div>
                <div className="rounded-xl border border-white/[0.08] bg-zinc-900/60 p-4">
                  <Cpu className="h-5 w-5 text-blue-400 mb-2" />
                  <div className="text-xs font-bold text-white">İSTE Mühendisliği</div>
                  <p className="text-[11px] text-zinc-400 mt-1">Donanım, gömülü sistem ve dağıtık yazılım temeli</p>
                </div>
                <div className="rounded-xl border border-white/[0.08] bg-zinc-900/60 p-4">
                  <Terminal className="h-5 w-5 text-cyan-400 mb-2" />
                  <div className="text-xs font-bold text-white">Global Cloud Standartları</div>
                  <p className="text-[11px] text-zinc-400 mt-1">Next.js 16, React Native ve otonom mikroservisler</p>
                </div>
              </div>
            </section>

            {/* Section III */}
            <section className="space-y-4 pt-4 border-t border-white/[0.06]">
              <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-white">
                III. Nexa'nın Değişmez Mühendislik Kanunları
              </h2>

              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0 mt-1" />
                  <div>
                    <strong className="text-white block font-display">%40 Ölçülebilir Operasyonel Tasarruf:</strong>
                    Geliştirdiğimiz hiçbir ürün kozmetik amaçlı değildir. Personelinizin manuel harcadığı mesaiyi %40 oranında düşürmeyen bir özelliği sisteme dahil etmeyiz.
                  </div>
                </li>

                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0 mt-1" />
                  <div>
                    <strong className="text-white block font-display">%100 Fikri Mülkiyet (IP) ve Kod Bağımsızlığı:</strong>
                    Kurumunuza özel geliştirdiğimiz web ve mobil yazılımlarda tüm kaynak kodlarını teslim ederiz. Müşterilerimizi bize mecbur bırakarak değil, memnuniyetle yanımızda tutarız.
                  </div>
                </li>

                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0 mt-1" />
                  <div>
                    <strong className="text-white block font-display">48 Saatte Teknik Mimari & 6 Haftada MVP:</strong>
                    Aylar süren toplantı bürokrasisini çöpe attık. Talebiniz geldikten 48 saat sonra kapsamlı mimari plan hazırdır. İlk çalışan sürüm 4-6 hafta içinde canlıdadır.
                  </div>
                </li>

                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0 mt-1" />
                  <div>
                    <strong className="text-white block font-display">Headless ve API-First Entegrasyon:</strong>
                    SAP, Logo, Mikro veya Salesforce fark etmez; altyapılarımız bağımsız konuşabilen REST, GraphQL ve Webhook protokolleriyle mevcut kurumsal omurganıza 18ms gecikmeyle bağlanır.
                  </div>
                </li>
              </ul>
            </section>

            {/* Section IV */}
            <section className="space-y-4 pt-4 border-t border-white/[0.06]">
              <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-white">
                IV. Geleceğe Davet
              </h2>
              <p>
                İster yüzlerce şantiyesi olan bir inşaat devi, ister binlerce randevu yöneten bir sağlık/hizmet zinciri, ister pazarını domine etmek isteyen bir kurumsal vizyoner olun:
              </p>
              <p className="text-white font-semibold text-lg">
                Sıradan yazılımları geride bırakın. İşletmenizi kendi kendini yöneten otonom bir ekosisteme dönüştürelim.
              </p>
            </section>

            {/* Signature Block */}
            <div className="pt-8 border-t border-white/[0.08] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
              <div>
                <p className="font-display text-lg font-bold text-white">Umut Erdoğan</p>
                <p className="text-xs text-zinc-400 font-mono">Kurucu & Baş Yazılım Mühendisi, Nexa</p>
                <p className="text-xs text-emerald-400 font-mono mt-0.5">İskenderun Teknik Üniversitesi Mezunu &bull; TEKNOFEST İnovatörü</p>
              </div>

              <a
                href="/teklif-al"
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-green-400 px-6 py-3 text-xs font-bold text-zinc-950 shadow-[0_0_20px_rgba(16,185,129,0.35)] hover:scale-[1.02] active:scale-95 transition-all"
              >
                <span>Projenizi Birlikte Planlayalım</span>
              </a>
            </div>
          </div>
        </div>
      </article>
    </MainLayout>
  );
}
