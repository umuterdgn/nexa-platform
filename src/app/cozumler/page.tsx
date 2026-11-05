import type { Metadata } from "next";
import Link from "next/link";
import { MainLayout } from "@/components/layout/MainLayout";
import { ROICalculator } from "@/components/cozumler/ROICalculator";
import { 
  Building, 
  ShoppingBag, 
  Smartphone, 
  ArrowRight, 
  CheckCircle2, 
  Cpu, 
  ShieldCheck, 
  TrendingDown, 
  Zap, 
  Layers 
} from "lucide-react";

export const metadata: Metadata = {
  title: "Sektörel Çözümler & Özel Yazılım Mimarisi | Nexa",
  description:
    "İnşaat ve şantiye yönetiminden perakende otomasyonuna, kuruma özel yüksek performanslı web/mobil uygulamalardan ROI hesaplayıcıya kadar Nexa kurumsal çözümleri.",
  alternates: {
    canonical: "https://nxa.com.tr/cozumler",
  },
};

export default function CozumlerPage() {
  return (
    <MainLayout>
      <div className="relative min-h-screen bg-zinc-950 text-foreground selection:bg-emerald-500/30 selection:text-emerald-300 py-16 sm:py-24">
        {/* Background Mesh */}
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute top-10 left-1/2 -translate-x-1/2 h-[500px] w-[800px] bg-gradient-to-b from-blue-600/10 via-emerald-500/5 to-transparent blur-[160px]" />
        </div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-1 text-xs font-mono font-medium text-emerald-400">
              <Cpu className="h-3.5 w-3.5" />
              Sektörel Mimariler & Dijital Dönüşüm
            </div>
            <h1 className="mt-4 font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
              Sektörünüze Özel{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-cyan-300 to-blue-400">
                Otonom Çözümler
              </span>
            </h1>
            <p className="mt-4 text-base sm:text-lg text-zinc-300 leading-relaxed">
              İşletmenizin operasyonel maliyetlerini %40 düşüren, verileri tek merkezde toplayan ve manuel iş gücü kayıplarını sıfırlayan kurumsal mimariler.
            </p>
          </div>

          {/* Interactive ROI Calculator Section */}
          <div className="mb-24">
            <ROICalculator />
          </div>

          {/* Sektörel Çözüm Detayları */}
          <div className="space-y-16">
            {/* Çözüm 1: İnşaat & Şantiye Yönetimi */}
            <div
              id="insaat"
              className="scroll-mt-24 rounded-3xl border border-white/10 bg-zinc-900/40 p-8 sm:p-12 backdrop-blur-xl relative overflow-hidden"
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
                <div>
                  <div className="inline-flex items-center gap-2 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-mono font-semibold text-emerald-400">
                    <Building className="h-4 w-4" />
                    İNŞAAT & ŞANTİYE OTONOMİSİ
                  </div>
                  <h2 className="mt-4 font-display text-2xl sm:text-4xl font-bold text-white tracking-tight">
                    Şantiye, Hakediş ve Malzeme Tedarik Zinciri
                  </h2>
                  <p className="mt-4 text-sm sm:text-base text-zinc-300 leading-relaxed">
                    Birden çok şantiyede devam eden beton dökümü, demir sevkiyatı, taşeron puantajı ve hakediş hesaplarını anlık tek bir ekranda toplayın. Sahadan girilen veriler anında genel merkez muhasebesine ve SAP sistemine yansır.
                  </p>

                  <ul className="mt-6 space-y-3 text-sm text-zinc-300">
                    <li className="flex items-center gap-2.5">
                      <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                      <span>Otomatik hakediş hesaplama ve taşeron kesintileri</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                      <span>Şantiye bazlı malzeme fire ve stok kritik seviye uyarıları</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                      <span>Mobil şantiye şefi portalı (iOS & Android çevrimdışı mod)</span>
                    </li>
                  </ul>

                  <div className="mt-8">
                    <Link
                      href="/urunler"
                      className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-400 hover:text-emerald-300"
                    >
                      <span>Nexa ERP Şantiye Modülünü İnceleyin</span>
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>

                <div className="rounded-2xl border border-white/[0.08] bg-zinc-950/80 p-6 font-mono text-xs text-zinc-300 space-y-3">
                  <div className="text-[11px] text-zinc-400 pb-2 border-b border-white/[0.06] flex justify-between">
                    <span>CANLI ŞANTİYE TELEMETRİSİ</span>
                    <span className="text-emerald-400">Aktif Sync</span>
                  </div>
                  <div className="rounded-lg bg-zinc-900/60 p-3 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-white font-semibold">Proje Apex Tower (Blok B)</span>
                      <span className="text-emerald-400 font-bold">%78 Tamamlandı</span>
                    </div>
                    <div className="h-1.5 w-full bg-zinc-800 rounded-full">
                      <div className="h-full bg-emerald-400 rounded-full w-[78%]" />
                    </div>
                  </div>
                  <div className="flex justify-between text-zinc-400 pt-1">
                    <span>Hakediş Onayı:</span>
                    <span className="text-white font-semibold">₺4.850.000 (Onaylandı)</span>
                  </div>
                  <div className="flex justify-between text-zinc-400">
                    <span>Stok Durumu:</span>
                    <span className="text-emerald-400 font-semibold">%99.8 Doğruluk</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Çözüm 2: Perakende & Çok Şubeli Sistemler */}
            <div
              id="perakende"
              className="scroll-mt-24 rounded-3xl border border-white/10 bg-zinc-900/40 p-8 sm:p-12 backdrop-blur-xl relative overflow-hidden"
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
                <div>
                  <div className="inline-flex items-center gap-2 rounded-lg border border-blue-500/30 bg-blue-500/10 px-3 py-1 text-xs font-mono font-semibold text-blue-400">
                    <ShoppingBag className="h-4 w-4" />
                    PERAKENDE & HİZMET ZİNCİRİ
                  </div>
                  <h2 className="mt-4 font-display text-2xl sm:text-4xl font-bold text-white tracking-tight">
                    Çok Şubeli Randevu, Kasa & WhatsApp Otomasyonu
                  </h2>
                  <p className="mt-4 text-sm sm:text-base text-zinc-300 leading-relaxed">
                    Klinikler, güzellik merkezleri, danışmanlıklar ve çok şubeli mağazalar için entegre müşteri akışı. Online rezervasyon, otomatik WhatsApp teyit mesajları ve PayTR tahsilatı ile randevu kaçırma oranını sıfırlayın.
                  </p>

                  <ul className="mt-6 space-y-3 text-sm text-zinc-300">
                    <li className="flex items-center gap-2.5">
                      <CheckCircle2 className="h-4 w-4 text-blue-400 shrink-0" />
                      <span>%0 No-Show (WhatsApp Webhook otomatik hatırlatma)</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <CheckCircle2 className="h-4 w-4 text-blue-400 shrink-0" />
                      <span>Çok şubeli personel ve oda takvimi senkronizasyonu</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <CheckCircle2 className="h-4 w-4 text-blue-400 shrink-0" />
                      <span>Entegre online ön ödeme veya kapıda tahsilat altyapısı</span>
                    </li>
                  </ul>

                  <div className="mt-8">
                    <Link
                      href="/urunler"
                      className="inline-flex items-center gap-2 text-sm font-semibold text-blue-400 hover:text-blue-300"
                    >
                      <span>Tam Vaktinde Çözümünü İnceleyin</span>
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>

                <div className="rounded-2xl border border-white/[0.08] bg-zinc-950/80 p-6 font-mono text-xs text-zinc-300 space-y-3">
                  <div className="text-[11px] text-zinc-400 pb-2 border-b border-white/[0.06] flex justify-between">
                    <span>RANDEVU VE PAZARYERİ CANLI AKIŞI</span>
                    <span className="text-blue-400">WhatsApp Online</span>
                  </div>
                  <div className="rounded-lg bg-zinc-900/60 p-3 space-y-1.5">
                    <div className="text-emerald-400 text-[11px] font-semibold">[WhatsApp Mesajı İletildi]</div>
                    <p className="text-zinc-300 text-xs font-sans">
                      "Sayın Ahmet Y., yarın saat 14:00 randevunuz onaylanmıştır. İptal için '1' yazınız."
                    </p>
                  </div>
                  <div className="flex justify-between text-zinc-400 pt-1">
                    <span>Kapasite Doluluk:</span>
                    <span className="text-white font-semibold">%94.2 (+%65 Artış)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Çözüm 3: Kuruma Özel (Custom) Yazılım */}
            <div
              id="custom"
              className="scroll-mt-24 rounded-3xl border border-white/10 bg-zinc-900/40 p-8 sm:p-12 backdrop-blur-xl relative overflow-hidden"
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
                <div>
                  <div className="inline-flex items-center gap-2 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-mono font-semibold text-emerald-400">
                    <Smartphone className="h-4 w-4" />
                    TERZİ İŞİ MÜHENDİSLİK
                  </div>
                  <h2 className="mt-4 font-display text-2xl sm:text-4xl font-bold text-white tracking-tight">
                    Özel Kurumsal Web Platformları & Mobil Uygulamalar
                  </h2>
                  <p className="mt-4 text-sm sm:text-base text-zinc-300 leading-relaxed">
                    Piyasada hazır paketi bulunmayan, şirketinize has iş kurallarını dijitalleştiren özel sistemler. Sıfırdan kodlanan iOS/Android uygulamaları, yüksek eşzamanlılıklı API omurgası ve %100 kod teslimi.
                  </p>

                  <ul className="mt-6 space-y-3 text-sm text-zinc-300">
                    <li className="flex items-center gap-2.5">
                      <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                      <span>Tam kaynak kod ve fikri mülkiyet (IP) devri</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                      <span>Next.js 16, React Native, Node.js/Go ve Docker altyapısı</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                      <span>48 saatte teknik fizibilite & mimari rapor teslimi</span>
                    </li>
                  </ul>

                  <div className="mt-8">
                    <Link
                      href="/teklif-al"
                      className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-400 hover:text-emerald-300"
                    >
                      <span>Projeniz İçin 48 Saatte Mimari Plan Alın</span>
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>

                <div className="rounded-2xl border border-white/[0.08] bg-zinc-950/80 p-6 font-mono text-xs text-zinc-300 space-y-3">
                  <div className="text-[11px] text-zinc-400 pb-2 border-b border-white/[0.06] flex justify-between">
                    <span>MİMARİ PERFORMANS GÖSTERGELERİ</span>
                    <span className="text-emerald-400">18ms P99</span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-zinc-400">
                      <span>Operasyonel Tasarruf:</span>
                      <span className="text-emerald-400 font-bold font-mono">-%40 Maliyet</span>
                    </div>
                    <div className="flex justify-between text-zinc-400">
                      <span>Sistem Eşzamanlılığı:</span>
                      <span className="text-white font-mono">100.000+ Anlık Bağlantı</span>
                    </div>
                    <div className="flex justify-between text-zinc-400">
                      <span>Güvenlik:</span>
                      <span className="text-white font-mono">ISO 27001 & KVKK Uyumlu</span>
                    </div>
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
