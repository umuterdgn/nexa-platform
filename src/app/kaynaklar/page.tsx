import type { Metadata } from "next";
import Link from "next/link";
import { MainLayout } from "@/components/layout/MainLayout";
import { LeadMagnetCard } from "@/components/home/LeadMagnetCard";
import { faqData } from "@/components/home/faqData";
import { 
  BookOpen, 
  FileCode2, 
  HelpCircle, 
  Terminal, 
  Server, 
  CheckCircle2, 
  ArrowRight,
  Code2,
  Database,
  Lock
} from "lucide-react";

export const metadata: Metadata = {
  title: "Kaynaklar, B2B SaaS Sözlüğü & API Dokümantasyonu | Nexa",
  description:
    "Headless ERP, multi-tenancy, SLA ve dağıtık mimari terimleri sözlüğü; SAP/Logo entegrasyon API dokümantasyonu ve karar vericiler için SSS rehberi.",
  alternates: {
    canonical: "https://nxa.com.tr/kaynaklar",
  },
};

const GLOSSARY_TERMS = [
  {
    term: "Headless ERP",
    category: "Mimari",
    definition:
      "Kullanıcı arayüzü (Frontend) ile iş mantığı ve veritabanı (Backend) katmanlarının birbirinden tamamen ayrıldığı, tüm işlemlerin REST veya GraphQL API'lar üzerinden yönetildiği modern yazılım mimarisi.",
  },
  {
    term: "Multi-Tenant Veri İzolasyonu",
    category: "Güvenlik & Cloud",
    definition:
      "Tek bir bulut altyapısı üzerinde birden fazla şirketin aynı uygulamayı kullandığı, ancak her şirketin verilerinin bağımsız şifrelenmiş mantıksal veya fiziksel veritabanı katmanlarında tamamen izole edildiği kurumsal model.",
  },
  {
    term: "P99 Latency (Gecikme)",
    category: "Performans",
    definition:
      "Sisteme gelen isteklerin %99'unun tamamlandığı maksimum süreyi ifade eder. Nexa altyapısında bu süre 18ms altındadır, bu da sistemin yoğun saatlerde dahi kesintisiz anlık yanıt verdiğini garantiler.",
  },
  {
    term: "Service Level Agreement (SLA)",
    category: "Kurumsal Güvence",
    definition:
      "Yazılım sağlayıcısının kuruma sunduğu resmi çalışma süresi taahhüdü. Nexa kurumsal sözleşmelerinde %99.99 Uptime ve 7/24 kritik müdahale garantisi standart olarak yer alır.",
  },
  {
    term: "High-Concurrency (Yüksek Eşzamanlılık)",
    category: "Mühendislik",
    definition:
      "Sistemin aynı milisaniyede binlerce farklı kullanıcıdan gelen istekleri (randevu rezervasyonu, şantiye veri girişi vb.) veri çakışması (race condition) olmadan sıfır hatayla işleyebilme kapasitesi.",
  },
  {
    term: "Webhook & Çift Yönlü Senkronizasyon",
    category: "Entegrasyon",
    definition:
      "Sistemde bir olay gerçekleştiğinde (örneğin hakediş onaylandığında veya yeni randevu alındığında) harici bir sisteme (SAP, Logo veya WhatsApp API) anında otomatik veri paketi fırlatan gerçek zamanlı haberleşme protokolü.",
  },
];

export default function KaynaklarPage() {
  return (
    <MainLayout>
      <div className="relative min-h-screen bg-zinc-950 text-foreground selection:bg-emerald-500/30 selection:text-emerald-300 py-16 sm:py-24">
        {/* Background Glow */}
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute top-20 left-1/2 -translate-x-1/2 h-[500px] w-[800px] bg-gradient-to-b from-blue-600/10 via-cyan-500/5 to-transparent blur-[160px]" />
        </div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3.5 py-1 text-xs font-mono font-medium text-cyan-400">
              <FileCode2 className="h-3.5 w-3.5" />
              Teknik Bilgi Bankası & Dokümantasyon
            </div>
            <h1 className="mt-4 font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
              B2B SaaS Sözlüğü,{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-emerald-300 to-green-400">
                API & Rehberler
              </span>
            </h1>
            <p className="mt-4 text-base sm:text-lg text-zinc-300 leading-relaxed">
              Otonom işletme terminolojisi, kurumsal entegrasyon standartları ve karar vericiler için şeffaf teknik kaynaklar.
            </p>
          </div>

          {/* Quick Jump Anchors */}
          <div className="flex flex-wrap items-center justify-center gap-3 mb-16">
            <a
              href="#sozluk"
              className="rounded-xl border border-white/10 bg-zinc-900/60 px-4 py-2 text-xs font-mono text-zinc-300 hover:border-emerald-500/40 hover:text-white transition"
            >
              # B2B SaaS Sözlüğü
            </a>
            <a
              href="#api"
              className="rounded-xl border border-white/10 bg-zinc-900/60 px-4 py-2 text-xs font-mono text-zinc-300 hover:border-blue-500/40 hover:text-white transition"
            >
              # API & Entegrasyon
            </a>
            <a
              href="#sss"
              className="rounded-xl border border-white/10 bg-zinc-900/60 px-4 py-2 text-xs font-mono text-zinc-300 hover:border-cyan-500/40 hover:text-white transition"
            >
              # Yönetici SSS
            </a>
          </div>

          {/* Bölüm 1: B2B SaaS Sözlüğü */}
          <section id="sozluk" className="scroll-mt-24 mb-24">
            <div className="flex items-center gap-3 mb-8">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                <BookOpen className="h-4 w-4" />
              </div>
              <div>
                <h2 className="font-display text-2xl sm:text-3xl font-bold text-white">
                  B2B SaaS & Otonom Mühendislik Sözlüğü
                </h2>
                <p className="text-xs text-zinc-400">Kurumsal mimariyi değerlendirirken bilmeniz gereken temel kavramlar</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {GLOSSARY_TERMS.map((item, idx) => (
                <div
                  key={idx}
                  className="rounded-2xl border border-white/[0.08] bg-zinc-900/40 p-6 backdrop-blur-md transition-all hover:border-emerald-500/40 hover:bg-zinc-900/70"
                >
                  <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
                    <span className="font-mono text-xs text-emerald-400 font-semibold">{item.category}</span>
                    <span className="font-mono text-[10px] text-zinc-400">#0{idx + 1}</span>
                  </div>
                  <h3 className="mt-4 font-display text-lg font-bold text-white">
                    {item.term}
                  </h3>
                  <p className="mt-2 text-xs text-zinc-300 leading-relaxed">
                    {item.definition}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Bölüm 2: API Dokümantasyonu & Entegrasyon Mimarisi */}
          <section id="api" className="scroll-mt-24 mb-24">
            <div className="rounded-3xl border border-white/10 bg-zinc-900/50 p-8 sm:p-12 backdrop-blur-xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-500/10 border border-blue-500/30 text-blue-400">
                  <Terminal className="h-4 w-4" />
                </div>
                <div>
                  <h2 className="font-display text-2xl sm:text-3xl font-bold text-white">
                    API Dokümantasyonu & Entegrasyon Katmanı
                  </h2>
                  <p className="text-xs text-zinc-400">SAP, Logo, Mikro ve kurumsal ERP/CRM sistemleriyle 18ms'de çift yönlü haberleşin</p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                <div className="space-y-4 text-sm text-zinc-300">
                  <p>
                    Nexa altyapısı, şirketinizin mevcut veri tabanlarını ve muhasebe sistemlerini çöpe atmanızı gerektirmez. API-First mimarimiz sayesinde tüm veri akışı iki yönlü otomatikleşir:
                  </p>
                  <ul className="space-y-2.5 text-xs text-zinc-300">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                      <span>REST & GraphQL Edge API uç noktaları (Auth bearer token ile korumalı)</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                      <span>Olay tabanlı (event-driven) Webhook altyapısı ile anlık tetikleme</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                      <span>İki yönlü şantiye stok ve hakediş mutabakatı</span>
                    </li>
                  </ul>
                </div>

                <div className="rounded-2xl border border-white/[0.08] bg-zinc-950 p-5 font-mono text-xs text-zinc-300 overflow-x-auto">
                  <div className="text-[11px] text-zinc-400 pb-2 border-b border-white/[0.06] flex justify-between">
                    <span>POST /api/v3/erp/sync</span>
                    <span className="text-emerald-400">HTTP 200 OK (14ms)</span>
                  </div>
                  <pre className="text-[11px] text-emerald-400/90 pt-3 leading-relaxed">
{`{
  "event": "stock.material_dispatched",
  "projectId": "apex-tower-b",
  "material": "HazirBeton_C35",
  "quantity": 180,
  "unit": "m3",
  "sapSyncStatus": "ACK_RECEIVED",
  "timestamp": "2026-10-19T14:30:00Z"
}`}
                  </pre>
                </div>
              </div>
            </div>
          </section>

          {/* Lead Magnet: B2B Digitalization PDF Report */}
          <LeadMagnetCard
            source="Resources_Glossary_Page"
            title="B2B Mimari & Dijitalleşme PDF Raporunu Edinin"
            subtitle="Kurumsal API mimarisi, multi-tenant veri tabanı yapılandırması ve ERP maliyet düşürme rehberi tek bir dokümanda."
          />

          {/* Bölüm 3: Yönetici SSS */}
          <section id="sss" className="scroll-mt-24">
            <div className="flex items-center gap-3 mb-8">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
                <HelpCircle className="h-4 w-4" />
              </div>
              <div>
                <h2 className="font-display text-2xl sm:text-3xl font-bold text-white">
                  Karar Vericiler ve CEO'lar İçin SSS
                </h2>
                <p className="text-xs text-zinc-400">Sözleşme, güvenlik, SLA ve teslimat şartları hakkında şeffaf yanıtlar</p>
              </div>
            </div>

            <div className="space-y-4 max-w-4xl">
              {faqData.map((item, idx) => (
                <div
                  key={idx}
                  className="rounded-2xl border border-white/[0.08] bg-zinc-900/40 p-6 backdrop-blur-md"
                >
                  <div className="flex items-start gap-3">
                    <span className="font-mono text-xs font-bold text-emerald-400 pt-0.5">0{idx + 1}</span>
                    <div>
                      <h3 className="font-display text-base sm:text-lg font-semibold text-white">
                        {item.question}
                      </h3>
                      <p className="mt-2 text-xs sm:text-sm text-zinc-300 leading-relaxed">
                        {item.answer}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </MainLayout>
  );
}
