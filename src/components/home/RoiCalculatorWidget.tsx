"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  TrendingDown,
  Calculator,
  ArrowRight,
  ShieldAlert,
  CheckCircle2,
  Users,
  Clock,
  Coins,
  Send,
  Sparkles,
  RefreshCw,
} from "lucide-react";

export function RoiCalculatorWidget() {
  // Girdiler
  const [personnelCount, setPersonnelCount] = useState<number>(18);
  const [weeklyHours, setWeeklyHours] = useState<number>(10);
  const [subcontractorVolume, setSubcontractorVolume] = useState<number>(2500000);

  // Quick Audit Email State
  const [isAuditModalOpen, setIsAuditModalOpen] = useState(false);
  const [auditEmail, setAuditEmail] = useState("");
  const [auditName, setAuditName] = useState("");
  const [auditCompany, setAuditCompany] = useState("");
  const [auditSending, setAuditSending] = useState(false);
  const [auditSuccess, setAuditSuccess] = useState(false);

  // Formül Hesaplaması:
  // (Haftalık Saat * 4.33 Hafta * Personel * Saatlik Maliyet ~180 ₺) + (Aylık Taşeron Hacmi * %3 Metraj Kaçağı) = Aylık Kaybedilen Tutar
  const calculations = useMemo(() => {
    const hourlyCost = 185; // ₺ / saatlik mühendislik ve operasyon maliyeti
    const monthlyLaborLoss = Math.round(weeklyHours * 4.33 * Math.max(1, personnelCount * 0.35) * hourlyCost);
    const monthlyMetrajLoss = Math.round(subcontractorVolume * 0.03); // %3 standart taşeron şişirmesi
    const monthlyTotalLoss = monthlyLaborLoss + monthlyMetrajLoss;
    const yearlyTotalLoss = monthlyTotalLoss * 12;

    return {
      monthlyLaborLoss,
      monthlyMetrajLoss,
      monthlyTotalLoss,
      yearlyTotalLoss,
    };
  }, [personnelCount, weeklyHours, subcontractorVolume]);

  const handleOpenSchedulerWithRoi = () => {
    const event = new CustomEvent("open-strategy-modal", {
      detail: {
        productSlug: "nexa-erp",
        roiLossEstimate: calculations.monthlyTotalLoss,
        notes: `[ROI Hesaplayıcı Telemetrisi]\nAktif Personel: ${personnelCount}\nHaftalık Manuel Operasyon: ${weeklyHours} saat\nAylık Taşeron Hacmi: ${subcontractorVolume.toLocaleString("tr-TR")} ₺\nTahmini Aylık Finansal Kaçak: ${calculations.monthlyTotalLoss.toLocaleString("tr-TR")} ₺\nTahmini Yıllık Nakit Kaçağı: ${calculations.yearlyTotalLoss.toLocaleString("tr-TR")} ₺`,
      },
    });
    window.dispatchEvent(event);
  };

  const handleSendAuditReport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auditEmail || !auditCompany) return;

    setAuditSending(true);
    try {
      const res = await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: auditEmail,
          name: auditName || auditEmail.split("@")[0],
          companyName: auditCompany,
          type: "audit_report",
          data: {
            roiLossMonthly: calculations.monthlyTotalLoss,
            roiLossYearly: calculations.yearlyTotalLoss,
            productTitle: "Nexa ERP (İnşaat CDE & 3D BIM)",
          },
        }),
      });

      if (res.ok) {
        setAuditSuccess(true);
      }
    } catch (err) {
      console.warn("Audit raporu gönderme hatası:", err);
    } finally {
      setAuditSending(false);
    }
  };

  return (
    <section className="relative my-20 px-4 sm:px-6 lg:px-8">
      {/* Background Glow */}
      <div className="pointer-events-none absolute -top-10 left-1/2 -translate-x-1/2 h-72 w-[600px] rounded-full bg-red-600/10 blur-[120px]" />

      <div className="relative mx-auto max-w-5xl rounded-3xl border border-red-500/25 bg-slate-950/90 p-6 sm:p-10 shadow-2xl backdrop-blur-xl">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 rounded-full border border-red-500/30 bg-red-500/10 px-3.5 py-1 text-xs font-mono font-bold text-red-400">
            <ShieldAlert className="h-4 w-4" />
            İnteraktif Dijitalleşme & Finansal Kaçak Hesaplayıcı
          </div>

          <h2 className="mt-4 text-2xl sm:text-4xl font-extrabold tracking-tight text-white">
            Şantiyenizde ve Operasyonunuzda Her Ay Ne Kadar Para Kaybediyorsunuz?
          </h2>

          <p className="mt-3 text-xs sm:text-sm text-slate-300">
            Manuel Excel hakedişleri, taşeron metraj şişirmeleri ve internetsiz sahadaki veri kayıplarının şirketinize maliyetini anlık simüle edin.
          </p>
        </div>

        {/* Sliders Grid */}
        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Girdi 1: Aktif Personel Sayısı */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
            <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-2">
              <span className="flex items-center gap-1.5">
                <Users className="h-4 w-4 text-cyan-400" />
                Aktif Personel / Mühendis
              </span>
              <span className="text-sm font-bold text-cyan-300">{personnelCount} Kişi</span>
            </div>
            <input
              type="range"
              min="1"
              max="150"
              value={personnelCount}
              onChange={(e) => setPersonnelCount(Number(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
            />
            <div className="mt-2 flex justify-between text-[11px] text-slate-500">
              <span>1 Kişi</span>
              <span>150 Kişi</span>
            </div>
          </div>

          {/* Girdi 2: Manuel Hakediş / Operasyon Haftalık Saat */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
            <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-2">
              <span className="flex items-center gap-1.5">
                <Clock className="h-4 w-4 text-blue-400" />
                Haftalık Manuel Operasyon
              </span>
              <span className="text-sm font-bold text-blue-300">{weeklyHours} Saat / hf</span>
            </div>
            <input
              type="range"
              min="1"
              max="40"
              value={weeklyHours}
              onChange={(e) => setWeeklyHours(Number(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-400"
            />
            <div className="mt-2 flex justify-between text-[11px] text-slate-500">
              <span>1 Saat</span>
              <span>40 Saat</span>
            </div>
          </div>

          {/* Girdi 3: Aylık Taşeron Hacmi */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
            <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-2">
              <span className="flex items-center gap-1.5">
                <Coins className="h-4 w-4 text-emerald-400" />
                Aylık Taşeron Hacmi
              </span>
              <span className="text-xs font-bold text-emerald-300">
                {(subcontractorVolume / 1000000).toFixed(1)} Milyon ₺
              </span>
            </div>
            <input
              type="range"
              min="200000"
              max="15000000"
              step="100000"
              value={subcontractorVolume}
              onChange={(e) => setSubcontractorVolume(Number(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-400"
            />
            <div className="mt-2 flex justify-between text-[11px] text-slate-500">
              <span>200 Bin ₺</span>
              <span>15 Milyon ₺</span>
            </div>
          </div>
        </div>

        {/* Büyük Neon Kırmızı Çıktı Kutusu */}
        <div className="mt-8 relative overflow-hidden rounded-2xl border-2 border-red-500/50 bg-gradient-to-b from-red-950/40 via-slate-950 to-slate-950 p-6 sm:p-8 text-center shadow-[0_0_50px_rgba(239,68,68,0.2)]">
          <div className="pointer-events-none absolute -top-12 left-1/2 -translate-x-1/2 h-32 w-64 rounded-full bg-red-500/30 blur-[60px]" />

          <span className="text-xs font-mono uppercase tracking-widest text-red-400 font-semibold">
            Şirketinizden Sessizce Çıkan Nakit Miktarı
          </span>

          {/* Aylık Toplam Kayıp */}
          <div className="mt-2">
            <motion.div
              key={calculations.monthlyTotalLoss}
              initial={{ scale: 0.95, opacity: 0.8 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.2 }}
              className="text-4xl sm:text-6xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-rose-300 to-amber-300 drop-shadow-[0_0_25px_rgba(244,63,94,0.6)]"
            >
              -{calculations.monthlyTotalLoss.toLocaleString("tr-TR")} ₺
              <span className="text-xl sm:text-2xl font-bold text-red-400 ml-2">/ Ay</span>
            </motion.div>
          </div>

          {/* Yıllık Birikimli Kayıp */}
          <p className="mt-2 text-xs sm:text-sm text-slate-300">
            Yıllık Toplam Nakit Kaçağı:{" "}
            <strong className="text-red-400 font-bold">
              -{calculations.yearlyTotalLoss.toLocaleString("tr-TR")} ₺ / Yıl
            </strong>
          </p>

          {/* Kayıp Kalemleri Ayrışımı */}
          <div className="mt-6 mx-auto grid max-w-2xl grid-cols-1 sm:grid-cols-2 gap-3 text-left">
            <div className="rounded-xl border border-red-500/20 bg-red-950/20 p-3">
              <span className="block text-[11px] font-mono text-red-300/80">Taşeron Metraj Şişirmesi (%3 Sapma)</span>
              <span className="text-base font-bold text-red-300">
                -{calculations.monthlyMetrajLoss.toLocaleString("tr-TR")} ₺ / ay
              </span>
            </div>
            <div className="rounded-xl border border-amber-500/20 bg-amber-950/20 p-3">
              <span className="block text-[11px] font-mono text-amber-300/80">Manuel Operasyon & Çift İşçilik</span>
              <span className="text-base font-bold text-amber-300">
                -{calculations.monthlyLaborLoss.toLocaleString("tr-TR")} ₺ / ay
              </span>
            </div>
          </div>

          {/* Güçlü CTA Bölümü */}
          <div className="mt-8 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              type="button"
              onClick={handleOpenSchedulerWithRoi}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-cyan-500 bg-[length:200%_auto] px-7 py-4 text-xs sm:text-sm font-extrabold text-white shadow-lg shadow-cyan-500/30 transition-all hover:bg-[right_center] hover:scale-[1.02] cursor-pointer"
            >
              <span>Nexa ERP ile Bu Kayıpları Bugün Sıfırlayın</span>
              <ArrowRight className="h-4 w-4" />
            </button>

            <button
              type="button"
              onClick={() => setIsAuditModalOpen(true)}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-900/90 px-5 py-4 text-xs font-semibold text-slate-200 hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <Send className="h-4 w-4 text-cyan-400" />
              <span>Ücretsiz Detaylı Audit Raporunu İste</span>
            </button>
          </div>
        </div>
      </div>

      {/* Audit Raporu Hızlı Gönderim Modalı */}
      {isAuditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="relative w-full max-w-md rounded-2xl border border-slate-800 bg-slate-950 p-6 shadow-2xl">
            {auditSuccess ? (
              <div className="text-center py-4">
                <CheckCircle2 className="mx-auto h-12 w-12 text-emerald-400" />
                <h4 className="mt-3 text-lg font-bold text-white">Rapor Gönderildi!</h4>
                <p className="mt-2 text-xs text-slate-300">
                  {auditCompany} için hazırlanan ön teknik audit raporu{" "}
                  <strong className="text-cyan-300">{auditEmail}</strong> adresinize iletildi.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setIsAuditModalOpen(false);
                    setAuditSuccess(false);
                  }}
                  className="mt-5 w-full rounded-xl bg-slate-800 py-2.5 text-xs font-semibold text-slate-200 hover:bg-slate-700"
                >
                  Tamam
                </button>
              </div>
            ) : (
              <form onSubmit={handleSendAuditReport} className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-cyan-400" />
                    Detaylı Dijitalleşme Audit Raporu
                  </h4>
                  <button
                    type="button"
                    onClick={() => setIsAuditModalOpen(false)}
                    className="text-xs text-slate-400 hover:text-white"
                  >
                    Kapat
                  </button>
                </div>

                <p className="text-xs text-slate-400">
                  Hesaplanan <strong>{calculations.monthlyTotalLoss.toLocaleString("tr-TR")} ₺</strong> aylık kaçağı sıfırlayacak teknik aksiyon planını e-postanıza gönderelim.
                </p>

                <div>
                  <label className="block text-xs text-slate-400 mb-1">Ad Soyad</label>
                  <input
                    type="text"
                    required
                    placeholder="Adınız"
                    value={auditName}
                    onChange={(e) => setAuditName(e.target.value)}
                    className="w-full rounded-xl border border-slate-800 bg-slate-900 px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-xs text-slate-400 mb-1">Şirket Adı</label>
                  <input
                    type="text"
                    required
                    placeholder="Şirketiniz A.Ş."
                    value={auditCompany}
                    onChange={(e) => setAuditCompany(e.target.value)}
                    className="w-full rounded-xl border border-slate-800 bg-slate-900 px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-xs text-slate-400 mb-1">Kurumsal E-posta</label>
                  <input
                    type="email"
                    required
                    placeholder="yonetici@sirketiniz.com"
                    value={auditEmail}
                    onChange={(e) => setAuditEmail(e.target.value)}
                    className="w-full rounded-xl border border-slate-800 bg-slate-900 px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <button
                  type="submit"
                  disabled={auditSending}
                  className="w-full rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 py-2.5 text-xs font-bold text-white shadow-md hover:from-cyan-400 hover:to-blue-500 disabled:opacity-50"
                >
                  {auditSending ? "Rapor İletiliyor..." : "Raporu E-Postama Gönder"}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </section>
  );
}

