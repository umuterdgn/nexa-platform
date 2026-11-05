"use client";

import React from "react";
import { motion } from "framer-motion";
import { CreditCard, TrendingUp, Utensils, QrCode } from "lucide-react";

/**
 * Nexa POS: Restoran, Cafe ve Perakende Kasa Otomasyonu & Ciro Line Chart Temsili UI
 * Kesinlikle stok fotoğraf içermez; animasyonlu SVG Line Chart ve Glassmorphism kasa arayüzü.
 */
export function PosFinanceMockup() {
  return (
    <figure
      role="img"
      aria-label="Nexa POS Çok Şubeli Bulut Kasa, QR Menü Mutfak ve Finans Ciro Line Chart Grafiği Temsili UI"
      className="relative mt-6 overflow-hidden rounded-2xl border border-cyan-500/20 bg-slate-950/90 p-4 font-mono text-xs shadow-2xl backdrop-blur-2xl"
    >
      <figcaption className="sr-only">
        Nexa POS Çok Şubeli Bulut Kasa, QR Menü Mutfak ve Finans Ciro Line Chart Grafiği Temsili UI
      </figcaption>

      {/* Üst Bar: Kasa ve STM Donanım Durumu */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
        <div className="flex items-center gap-1.5">
          <CreditCard className="w-3.5 h-3.5 text-cyan-400" />
          <span className="text-[11px] font-semibold text-slate-300">
            STM & Artı POS Köprüsü
          </span>
        </div>
        <span className="text-[10px] text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-2 py-0.5 rounded font-bold">
          18ms P99 Kasa
        </span>
      </div>

      {/* Ciro Trendi: Şık Animasyonlu Line Chart (Sparkline SVG) */}
      <div className="mt-3 p-3 rounded-xl bg-slate-900/60 border border-slate-800/80">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] text-slate-400 flex items-center gap-1">
            <TrendingUp className="w-3 h-3 text-cyan-400" />
            Anlık Şube Finans / Ciro Akışı
          </span>
          <span className="text-xs font-bold text-white">48.250 ₺</span>
        </div>

        {/* SVG Animasyonlu Line Chart */}
        <div className="relative h-16 w-full">
          <svg
            className="w-full h-full overflow-visible"
            viewBox="0 0 240 60"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            role="img"
            aria-label="Gün İçi Şube Ciro Trendi Line Chart Grafiği"
          >
            {/* Arka Plan Gradyan Dolgusu */}
            <defs>
              <linearGradient id="posLineGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.35" />
                <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Dolgu Alanı */}
            <motion.path
              d="M0 45 Q 40 50, 60 30 T 120 20 T 180 35 T 240 8 L 240 60 L 0 60 Z"
              fill="url(#posLineGrad)"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1 }}
            />

            {/* Çizgi Grafiği (Line Chart) */}
            <motion.path
              d="M0 45 Q 40 50, 60 30 T 120 20 T 180 35 T 240 8"
              stroke="#06b6d4"
              strokeWidth="2.5"
              strokeLinecap="round"
              fill="none"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
            />

            {/* Anlık Zirve Noktası */}
            <circle cx="240" cy="8" r="3.5" fill="#22d3ee" className="animate-ping" />
            <circle cx="240" cy="8" r="3" fill="#ffffff" />
          </svg>
        </div>
      </div>

      {/* Alt Bar: QR Masa Sipariş & Garson-Mutfak Entegrasyonu */}
      <div className="mt-3 grid grid-cols-2 gap-2 text-[10px]">
        <div className="p-2 rounded-lg bg-slate-950/80 border border-slate-800 flex items-center gap-1.5 text-slate-300">
          <QrCode className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
          <div>
            <span className="block font-semibold text-white">Masa 14 (QR)</span>
            <span className="text-[9px] text-slate-500">Mutfak KDS&apos;ye İletildi</span>
          </div>
        </div>

        <div className="p-2 rounded-lg bg-slate-950/80 border border-slate-800 flex items-center gap-1.5 text-slate-300">
          <Utensils className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          <div>
            <span className="block font-semibold text-white">Stok Düşümü</span>
            <span className="text-[9px] text-emerald-400 font-mono">Otomatik Senkron</span>
          </div>
        </div>
      </div>
    </figure>
  );
}

