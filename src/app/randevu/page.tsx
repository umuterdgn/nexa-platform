import { Metadata } from "next";
import { MainLayout } from "@/components/layout/MainLayout";
import { InHouseScheduler } from "@/components/scheduler/InHouseScheduler";
import { ShieldCheck, Video, Clock, Code2, Cpu, Sparkles } from "lucide-react";

export const metadata: Metadata = {
  title: "Strateji & Teknik Mimari Toplantısı Planla | Nexa In-House Scheduler",
  description:
    "Kurucu & Sistem Mimarı Umut Erdoğan ile 45 dakikalık birebir Google Meet seansı. Şantiye Dexie.js PWA, 3D BIM hakediş blokesi ve kurumsal ERP fizibilitesi.",
  alternates: {
    canonical: "https://nxa.com.tr/randevu",
  },
};

export default function RandevuPage() {
  return (
    <MainLayout>
      <div className="relative min-h-screen bg-slate-950 text-slate-100 py-16 px-4 sm:px-6 lg:px-8 selection:bg-cyan-500/30 selection:text-cyan-200">
        {/* Deep-Tech Gradient Background */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[900px] rounded-full bg-cyan-600/10 blur-[140px]" />
          <div className="absolute top-2/3 right-10 h-[400px] w-[500px] rounded-full bg-blue-600/10 blur-[130px]" />
        </div>

        <div className="relative mx-auto max-w-6xl">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-4 py-1.5 text-xs font-mono font-medium text-cyan-400">
              <Sparkles className="h-3.5 w-3.5" />
              Otonom B2B Satış & Mimari Otomasyonu
            </div>

            <h1 className="mt-4 text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
              Strateji & Teknik Mimari Seansı Planla
            </h1>

            <p className="mt-4 text-sm sm:text-base text-slate-300 leading-relaxed">
              Satış temsilcisiyle değil, sistemin mimarıyla görüşün. Kurucu & Baş Yazılım Mühendisi{" "}
              <strong className="text-white">Umut Erdoğan</strong> ile 45 dakikalık odaklı mimari değerlendirme.
            </p>

            {/* Badges */}
            <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-xs font-medium text-slate-400">
              <div className="flex items-center gap-1.5 rounded-lg border border-slate-800 bg-slate-900/60 px-3 py-1.5">
                <Video className="h-4 w-4 text-cyan-400" />
                <span>Google Meet Odası</span>
              </div>
              <div className="flex items-center gap-1.5 rounded-lg border border-slate-800 bg-slate-900/60 px-3 py-1.5">
                <Clock className="h-4 w-4 text-blue-400" />
                <span>45 Dakika Odaklı Seans</span>
              </div>
              <div className="flex items-center gap-1.5 rounded-lg border border-slate-800 bg-slate-900/60 px-3 py-1.5">
                <ShieldCheck className="h-4 w-4 text-emerald-400" />
                <span>%100 NDA & Veri Gizliliği</span>
              </div>
            </div>
          </div>

          {/* Grid Layout: Scheduler + Enterprise Sidebar */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Scheduler Component Container */}
            <div className="lg:col-span-8">
              <InHouseScheduler />
            </div>

            {/* Enterprise Trust & Process Sidebar */}
            <div className="lg:col-span-4 space-y-5">
              <div className="rounded-2xl border border-slate-800/80 bg-slate-900/60 p-6 backdrop-blur-sm">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Cpu className="h-4 w-4 text-cyan-400" />
                  Görüşme Gündemi & Odak Alanları
                </h3>
                <ul className="mt-4 space-y-3 text-xs text-slate-300">
                  <li className="flex items-start gap-2.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 mt-1.5 shrink-0" />
                    <span><strong>Şantiye Şartlarında Dexie.js Çevrimdışı PWA:</strong> İnternet olmayan katlarda veri kaybını sıfırlama mimarisi.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 mt-1.5 shrink-0" />
                    <span><strong>3D BIM Otomatik Hakediş Blokesi:</strong> Taşeron metraj şişirmesini sahada otomatik bloke eden algoritma.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 mt-1.5 shrink-0" />
                    <span><strong>Mevcut ERP & Muhasebe Entegrasyonu:</strong> SAP, Mikro, Logo veya şirket içi sunucularla hibrit çalışma.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 mt-1.5 shrink-0" />
                    <span><strong>ROI ve Yatırım Geri Dönüş Analizi:</strong> Personel mesai ve hakediş kaçaklarının finansal simülasyonu.</span>
                  </li>
                </ul>
              </div>

              <div className="rounded-2xl border border-slate-800/80 bg-slate-900/60 p-6 backdrop-blur-sm">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Code2 className="h-4 w-4 text-blue-400" />
                  Mühendislik Prensipleri
                </h3>
                <p className="mt-2 text-xs text-slate-400 leading-relaxed">
                  Nexa&apos;da satış baskısı veya hazır paket şablon dayatması yoktur. İhtiyaçlarınıza özel veritabanı şeması, sunucusuz PostgreSQL mimarisi ve donanım entegrasyonu birebir analiz edilir.
                </p>
                <div className="mt-4 pt-4 border-t border-slate-800 flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-cyan-400 text-sm">
                    UE
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">Umut Erdoğan</h4>
                    <p className="text-[11px] text-slate-400">Kurucu & Sistem Mimarı &bull; Nexa Global</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

