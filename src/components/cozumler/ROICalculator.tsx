"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Users, Clock, TrendingDown, ShieldCheck, Zap, ArrowRight, Video } from "lucide-react";
import { openStrategyCallModal } from "@/lib/modal-events";

export function ROICalculator() {
  const [employees, setEmployees] = useState<number>(60);

  // Dynamic calculations based on B2B operational heuristics
  // 1 employee saves ~320 hours/year through automated ERP/SaaS workflows
  const savedHours = Math.round(employees * 320);

  // Average operational efficiency savings per employee: ~48,000 TRY/year
  const savedCost = Math.round(employees * 48000);

  // Payback period in months
  const paybackMonths = (2.2 - (employees / 500) * 0.8).toFixed(1);

  const presets = [20, 50, 100, 250, 500];

  return (
    <div id="roi-calculator" className="relative mx-auto max-w-5xl overflow-hidden rounded-3xl border border-white/10 bg-zinc-900/60 p-6 sm:p-12 backdrop-blur-2xl shadow-2xl">
      {/* Background Glow */}
      <div className="pointer-events-none absolute -top-32 -right-32 h-96 w-96 rounded-full bg-emerald-500/10 blur-[120px]" />
      <div className="pointer-events-none absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-blue-500/10 blur-[120px]" />

      <div className="relative">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-1 text-xs font-mono font-semibold text-emerald-400">
            <Zap className="h-3.5 w-3.5" />
            ROI & Verimlilik Simülatörü
          </div>
          <h3 className="mt-4 font-display text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            Nexa Otonom Altyapısı ile Ne Kadar Tasarruf Edersiniz?
          </h3>
          <p className="mt-3 text-sm sm:text-base text-zinc-300">
            Şirketinizdeki personel sayısını seçin; rutin işlerin otomasyona geçmesiyle elde edeceğiniz zaman ve operasyonel maliyet kazanımını canlı görün.
          </p>
        </div>

        {/* Slider Controls */}
        <div className="rounded-2xl border border-white/[0.08] bg-zinc-950/70 p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                <Users className="h-4 w-4" />
              </div>
              <div>
                <span className="font-display text-base font-semibold text-white">Toplam Personel Sayısı</span>
                <p className="text-xs text-zinc-400">Şantiye, mağaza ve merkez ofis çalışanları</p>
              </div>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-auto">
              <span className="font-mono text-3xl sm:text-4xl font-extrabold text-emerald-400">
                {employees}
              </span>
              <span className="text-xs font-mono text-zinc-400 uppercase">Kişi</span>
            </div>
          </div>

          {/* Range Slider */}
          <div className="py-4">
            <input
              type="range"
              min="10"
              max="500"
              step="5"
              value={employees}
              onChange={(e) => setEmployees(Number(e.target.value))}
              className="w-full h-3 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-emerald-400 focus:outline-none"
            />
            <div className="flex justify-between text-[11px] font-mono text-zinc-400 mt-2">
              <span>10 Personel</span>
              <span>100</span>
              <span>250</span>
              <span>500+ Personel</span>
            </div>
          </div>

          {/* Quick Preset Buttons */}
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-white/[0.06]">
            <span className="text-xs font-mono text-zinc-400 mr-2">Hızlı Seçim:</span>
            {presets.map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setEmployees(p)}
                className={`rounded-lg px-3 py-1 text-xs font-mono font-medium border transition-all ${
                  employees === p
                    ? "bg-emerald-500/20 border-emerald-500/50 text-emerald-300 shadow-[0_0_12px_rgba(16,185,129,0.3)]"
                    : "bg-zinc-900 border-white/5 text-zinc-400 hover:text-white hover:border-white/20"
                }`}
              >
                {p} Kişi
              </button>
            ))}
          </div>
        </div>

        {/* Dynamic Animated Output Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mt-8">
          {/* Card 1: Yıllık Tasarruf Edilen Saat */}
          <motion.div
            key={savedHours}
            initial={{ scale: 0.98, opacity: 0.8 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.2 }}
            className="rounded-2xl border border-emerald-500/30 bg-emerald-500/[0.04] p-6 backdrop-blur-md relative overflow-hidden"
          >
            <div className="flex items-center justify-between text-zinc-400">
              <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400 font-mono">
                Zaman Geri Kazanımı
              </span>
              <Clock className="h-4 w-4 text-emerald-400" />
            </div>

            <div className="mt-3">
              <div className="font-mono text-3xl sm:text-4xl font-extrabold text-white">
                {savedHours.toLocaleString("tr-TR")}
                <span className="text-lg text-emerald-400 ml-1">Saat / Yıl</span>
              </div>
              <p className="mt-2 text-xs text-zinc-300 leading-relaxed">
                Manuel veri aktarımı, mükerrer evrak ve koordinasyon kayıplarının otonomizasyonu ile tasarruf edilen iş gücü.
              </p>
            </div>
          </motion.div>

          {/* Card 2: Operasyonel Maliyet Düşüşü */}
          <motion.div
            key={savedCost}
            initial={{ scale: 0.98, opacity: 0.8 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.2 }}
            className="rounded-2xl border border-blue-500/30 bg-blue-500/[0.04] p-6 backdrop-blur-md relative overflow-hidden"
          >
            <div className="flex items-center justify-between text-zinc-400">
              <span className="text-xs font-semibold uppercase tracking-wider text-blue-400 font-mono">
                Operasyonel Maliyet Düşüşü
              </span>
              <TrendingDown className="h-4 w-4 text-blue-400" />
            </div>

            <div className="mt-3">
              <div className="font-mono text-3xl sm:text-4xl font-extrabold text-white">
                ₺{savedCost.toLocaleString("tr-TR")}
                <span className="text-sm text-blue-400 ml-1">/ Yıl</span>
              </div>
              <p className="mt-2 text-xs text-zinc-300 leading-relaxed">
                Rutin operasyon giderlerinde ortalama <strong className="text-emerald-400">%40 net tasarruf</strong> karşılığıdır.
              </p>
            </div>
          </motion.div>

          {/* Card 3: Yatırımın Geri Dönüşü (Amortisman) */}
          <div className="rounded-2xl border border-white/10 bg-zinc-950/60 p-6 backdrop-blur-md">
            <div className="flex items-center justify-between text-zinc-400">
              <span className="text-xs font-semibold uppercase tracking-wider text-zinc-300 font-mono">
                Amortisman Süresi
              </span>
              <ShieldCheck className="h-4 w-4 text-cyan-400" />
            </div>

            <div className="mt-3">
              <div className="font-mono text-3xl sm:text-4xl font-extrabold text-white">
                ~{paybackMonths}
                <span className="text-lg text-cyan-400 ml-1">Ay</span>
              </div>
              <p className="mt-2 text-xs text-zinc-300 leading-relaxed">
                Nexa ekosistemine yapılan yatırımın kendini tam amorti ettiği kanıtlanmış kurumsal süre.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Bar */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 rounded-xl border border-white/[0.08] bg-zinc-950/80 p-4 sm:p-5">
          <div className="text-left">
            <span className="text-xs font-semibold text-white">Bu tasarrufu işletmenize entegre etmek ister misiniz?</span>
            <p className="text-[11px] text-zinc-400">Kurucu & Baş Yazılım Mühendisi Umut Erdoğan ile 30 dk teknik fizibilite görüşmesi yapın.</p>
          </div>

          <button
            type="button"
            onClick={() => openStrategyCallModal()}
            className="shrink-0 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 via-green-400 to-emerald-400 px-6 py-3 text-xs sm:text-sm font-bold text-zinc-950 shadow-[0_0_20px_rgba(16,185,129,0.35)] transition-all hover:shadow-[0_0_30px_rgba(16,185,129,0.55)] hover:scale-[1.02] active:scale-95"
          >
            <Video className="h-4 w-4" />
            <span>Strateji Toplantısı Ayırtın</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
