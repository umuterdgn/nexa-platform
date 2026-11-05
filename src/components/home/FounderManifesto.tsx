import React from "react";
import Link from "next/link";
import {
  Terminal,
  Database,
  WifiOff,
  Cpu,
  Layers,
  ShieldCheck,
  ArrowRight,
  Code2,
  CheckCircle2,
} from "lucide-react";

/**
 * Founder Manifesto (Neden Nexa? / Hakkımızda):
 * Şirket vizyonunu ve teknik yaklaşımı kurucunun dilinden (Umut Erdoğan) şeffaf şekilde anlatan kurumsal bölüm.
 */
export function FounderManifesto() {
  return (
    <section
      id="manifesto"
      className="relative py-24 sm:py-32 overflow-hidden border-t border-slate-800/80 bg-slate-950"
    >
      {/* Ambient Radial Gradient */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute top-1/2 left-1/3 -translate-y-1/2 h-[500px] w-[500px] bg-blue-600/[0.04] blur-[150px]" />
        <div className="absolute bottom-10 right-10 h-[450px] w-[450px] bg-cyan-500/[0.05] blur-[140px]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Sol Kolon: Kurucu Mektubu & Vizyon */}
          <div className="lg:col-span-7">
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3.5 py-1 text-xs font-mono font-semibold text-cyan-400 mb-6">
              <Terminal className="h-3.5 w-3.5" />
              Neden Nexa? &bull; Kurucu Mühendislik Manifestosu
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
              Yazılım Şirketi Değil,{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-300">
                İşletmenizin Dijital Mühendislik Ortağıyız.
              </span>
            </h2>

            <div className="mt-8 space-y-5 text-base sm:text-lg text-slate-300 leading-relaxed font-sans">
              <p>
                B2B dünyasında karşılaştığımız en büyük sorun, şirketlerin 20 yıl
                öncesinin hantal, mobil desteği olmayan ve internet koptuğunda
                çöken monolitik ERP sistemlerine mahkum bırakılmasıdır.
              </p>
              <p>
                Nexa&apos;yı kurarken tek bir ilkemiz vardı:{" "}
                <strong className="text-white">
                  Şantiyenin tozundan holding yönetim kuruluna kadar pürüzsüz çalışan,
                  asla veri kaybetmeyen ve şirketinizin mevcut yatırımlarını (SAP,
                  Logo) çöpe atmadan modernize eden otonom ekosistemler inşa etmek.
                </strong>
              </p>
            </div>

            {/* Teknik Felsefe Kartları (Semantik <ul>/<li>) */}
            <div className="mt-10 pt-8 border-t border-slate-800/80">
              <h3 className="text-sm font-mono uppercase tracking-wider text-cyan-400 mb-4">
                Mimari İlkelerimiz ve Neden Bu Teknolojileri Seçtik?
              </h3>

              <ul className="space-y-4">
                <li className="flex items-start gap-4 p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
                  <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 shrink-0 mt-0.5">
                    <WifiOff className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">
                      Neden Dexie.js & IndexedDB (Offline-First)?
                    </h4>
                    <p className="text-xs sm:text-sm text-slate-400 mt-1">
                      Şantiyede, madende veya bodrum katlarda internet koptuğunda
                      operasyon duramaz. Dexie.js ile tüm hakediş, puantaj ve stok
                      hareketlerini yerel bellekte şifreleyerek kaydediyoruz; internet
                      geldiği milisaniyede bulutla çift yönlü senkronize ediyoruz.
                    </p>
                  </div>
                </li>

                <li className="flex items-start gap-4 p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
                  <div className="p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 shrink-0 mt-0.5">
                    <Database className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">
                      Neden NeonDB & Serverless PostgreSQL?
                    </h4>
                    <p className="text-xs sm:text-sm text-slate-400 mt-1">
                      Her kurumsal müşterimiz için bağımsız veri tabanı şeması ve
                      anında veri tabanı klonlama (database branching) sağlıyoruz. Bu
                      sayede veri izolasyonu, sıfır soğuk başlangıç ve yüksek
                      güvenlik elde ediyoruz.
                    </p>
                  </div>
                </li>

                <li className="flex items-start gap-4 p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
                  <div className="p-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 shrink-0 mt-0.5">
                    <Layers className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">
                      Neden SAP & OData Entegrasyonu?
                    </h4>
                    <p className="text-xs sm:text-sm text-slate-400 mt-1">
                      Şirketlerin çalışanlarına SAP GUI öğretmek yerine, sahadaki
                      ustanın veya satış temsilcisinin 3 saniyede veri girebileceği
                      modern Next.js ve React Native arayüzleri geliştirip arkada SAP
                      ile konuştuyoruz.
                    </p>
                  </div>
                </li>
              </ul>
            </div>

            {/* Kurucu İmzası */}
            <div className="mt-10 flex items-center gap-4 pt-6 border-t border-slate-800">
              <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white font-extrabold text-base shadow-lg shadow-cyan-500/20">
                UE
              </div>
              <div>
                <span className="font-bold text-white block text-sm">
                  Umut Erdoğan
                </span>
                <span className="text-xs text-cyan-400 font-mono">
                  Kurucu & Baş Yazılım Mühendisi, Nexa
                </span>
              </div>
            </div>
          </div>

          {/* Sağ Kolon: Teknik Metrikler & Mühendislik Karşılaştırma Tablosu */}
          <div className="lg:col-span-5 bg-gradient-to-b from-slate-900 via-slate-900/90 to-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-cyan-400" />
              Geleneksel Yazılımlar vs. Nexa Mimarisi
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Kurumunuz için doğru teknolojiyi seçerken göz önünde bulundurmanız gereken
              farklar:
            </p>

            {/* Semantik Karşılaştırma Tablosu (<table>) */}
            <div className="mt-6 overflow-hidden rounded-2xl border border-slate-800">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950 text-slate-400 font-mono uppercase tracking-wider border-b border-slate-800 text-[10px]">
                  <tr>
                    <th className="py-3 px-3.5 font-semibold">Kriter</th>
                    <th className="py-3 px-3.5 font-semibold text-rose-400">Eski ERP&apos;ler</th>
                    <th className="py-3 px-3.5 font-semibold text-cyan-400">Nexa Mimarisi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80 text-slate-300">
                  <tr className="hover:bg-slate-800/40">
                    <td className="py-3 px-3.5 font-semibold text-white">Çevrimdışı Çalışma</td>
                    <td className="py-3 px-3.5 text-rose-300/80">İnternetsiz Çöker</td>
                    <td className="py-3 px-3.5 text-cyan-300 font-semibold">%100 Dexie.js PWA</td>
                  </tr>
                  <tr className="hover:bg-slate-800/40">
                    <td className="py-3 px-3.5 font-semibold text-white">Taşeron Metrajı</td>
                    <td className="py-3 px-3.5 text-rose-300/80">Manuel Excel & Şişirme</td>
                    <td className="py-3 px-3.5 text-cyan-300 font-semibold">5D BIM Otomatik Bloke</td>
                  </tr>
                  <tr className="hover:bg-slate-800/40">
                    <td className="py-3 px-3.5 font-semibold text-white">İskele / Saha İSG</td>
                    <td className="py-3 px-3.5 text-rose-300/80">Kağıt Tutanak</td>
                    <td className="py-3 px-3.5 text-cyan-300 font-semibold">BLE Beacon & Geofence</td>
                  </tr>
                  <tr className="hover:bg-slate-800/40">
                    <td className="py-3 px-3.5 font-semibold text-white">Mülkiyet & Lisans</td>
                    <td className="py-3 px-3.5 text-rose-300/80">Yıllık Fahiş Kiralama</td>
                    <td className="py-3 px-3.5 text-cyan-300 font-semibold">%100 IP & Kod Teslimi</td>
                  </tr>
                  <tr className="hover:bg-slate-800/40">
                    <td className="py-3 px-3.5 font-semibold text-white">Veri Mimarisi</td>
                    <td className="py-3 px-3.5 text-rose-300/80">Eski On-Premises DB</td>
                    <td className="py-3 px-3.5 text-cyan-300 font-semibold">NeonDB Serverless PG</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Aksiyon Çağrısı */}
            <div className="mt-8 pt-6 border-t border-slate-800 text-center">
              <Link
                href="/manifesto"
                className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-cyan-400 hover:text-cyan-300 transition"
              >
                <span>Tüm Mühendislik Manifestomuzu Oku</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

