"use client";

import React from "react";
import { motion } from "framer-motion";
import { Truck, Navigation, MapPin, Zap } from "lucide-react";

/**
 * Nexa Commerce: Lojistik Filo GPS & Rota Optimizasyonu Temsili UI Mockup
 * Kesinlikle stok fotoğraf içermez; vektörel rota haritası ve telemetri telemetri kartı.
 */
export function FleetRadarMockup() {
  return (
    <figure
      role="img"
      aria-label="Nexa Commerce Headless E-Ticaret ve Canlı Filo GPS Rota Optimizasyonu Temsili UI Mockup"
      className="relative mt-6 overflow-hidden rounded-2xl border border-blue-500/20 bg-slate-950/90 p-4 font-mono text-xs shadow-2xl backdrop-blur-2xl"
    >
      <figcaption className="sr-only">
        Nexa Commerce Headless E-Ticaret ve Canlı Filo GPS Rota Optimizasyonu Temsili UI Mockup
      </figcaption>

      {/* Üst Bar: Filo Telemetrisi */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
        <div className="flex items-center gap-1.5">
          <Truck className="w-3.5 h-3.5 text-blue-400" />
          <span className="text-[11px] font-semibold text-slate-300">
            Canlı Filo Telemetrisi
          </span>
        </div>
        <span className="text-[10px] text-cyan-300 bg-cyan-950/60 border border-cyan-500/30 px-2 py-0.5 rounded font-bold">
          15 Aktif Araç
        </span>
      </div>

      {/* Vektörel Harita ve Rota Optimizasyonu Mockup'ı */}
      <div className="relative mt-3 h-20 w-full rounded-xl bg-slate-900/60 border border-slate-800/80 p-2 overflow-hidden flex items-center justify-center">
        {/* Soyut Izgara & Rota Çizimi (SVG) */}
        <svg
          className="w-full h-full"
          viewBox="0 0 220 70"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          role="img"
          aria-label="Canlı Filo GPS Rota Çizgisi"
        >
          {/* Harita Yolları */}
          <path
            d="M10 50 L60 50 L90 20 L160 20 L200 45"
            stroke="rgba(255,255,255,0.08)"
            strokeWidth="3"
            strokeLinecap="round"
          />
          {/* Optimize Edilmiş Yapay Zeka Rotası (Mavi/Cyan) */}
          <motion.path
            d="M10 50 L60 50 L90 20 L160 20 L200 45"
            stroke="#3b82f6"
            strokeWidth="2"
            strokeDasharray="4 4"
            fill="none"
            initial={{ strokeDashoffset: 50 }}
            animate={{ strokeDashoffset: 0 }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          />

          {/* Durak Noktaları */}
          <circle cx="10" cy="50" r="3" fill="#94a3b8" />
          <circle cx="60" cy="50" r="3" fill="#94a3b8" />
          <circle cx="90" cy="20" r="3" fill="#94a3b8" />
          <circle cx="160" cy="20" r="3.5" fill="#06b6d4" className="animate-ping" />
          <circle cx="160" cy="20" r="3" fill="#06b6d4" />
          <circle cx="200" cy="45" r="3.5" fill="#10b981" />
        </svg>

        {/* Canlı Araç Göstergesi */}
        <div className="absolute top-2 right-2 flex items-center gap-1 text-[9px] text-emerald-400 bg-slate-950/80 px-2 py-0.5 rounded border border-slate-800">
          <Zap className="w-2.5 h-2.5" />
          <span>-%32 Yakıt Tasarrufu</span>
        </div>
      </div>

      {/* Alt Bilgi: WhatsApp Hatırlatıcı CRM & API Süresi */}
      <div className="mt-3 grid grid-cols-2 gap-2 text-[10px]">
        <div className="p-2 rounded-lg bg-slate-950/80 border border-slate-800 flex items-center gap-1.5 text-slate-300">
          <Navigation className="w-3.5 h-3.5 text-blue-400 shrink-0" />
          <div>
            <span className="block font-semibold text-white">ETA: 14 Dk</span>
            <span className="text-[9px] text-slate-500">Müşteriye SMS İletildi</span>
          </div>
        </div>

        <div className="p-2 rounded-lg bg-slate-950/80 border border-slate-800 flex items-center gap-1.5 text-slate-300">
          <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          <div>
            <span className="block font-semibold text-white">POD Teslim</span>
            <span className="text-[9px] text-emerald-400 font-mono">Fotoğraflı Onay</span>
          </div>
        </div>
      </div>
    </figure>
  );
}

