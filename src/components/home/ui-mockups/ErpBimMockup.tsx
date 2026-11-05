"use client";

import React from "react";
import { motion } from "framer-motion";
import { WifiOff, AlertTriangle, CheckCircle2, Box } from "lucide-react";

/**
 * Nexa ERP: 3D Soyut İzometrik BIM Mesh & Çevrimdışı Hakediş Blokesi Temsili UI
 * Kesinlikle stok fotoğraf içermez; saf SVG, Glassmorphism ve Tailwind ile üretilmiş Deep-Tech UI.
 */
export function ErpBimMockup() {
  return (
    <figure
      role="img"
      aria-label="Nexa ERP Çevrimdışı Offline Şantiye Veri Senkronizasyonu ve 3D BIM Hakediş Blokesi Temsili UI"
      className="relative mt-6 overflow-hidden rounded-2xl border border-cyan-500/20 bg-slate-950/90 p-4 sm:p-5 font-mono text-xs shadow-2xl backdrop-blur-2xl"
    >
      {/* Görsel SEO İçin Gizli Erişilebilirlik Tanımı */}
      <figcaption className="sr-only">
        Nexa ERP Çevrimdışı Offline Şantiye Veri Senkronizasyonu ve 3D BIM Hakediş Blokesi Temsili UI Mockup
      </figcaption>

      {/* Üst Bar: Canlı Durum & PWA Senkronizasyon Göstergesi */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-400" />
          </span>
          <span className="text-[11px] font-semibold text-slate-300">
            CDE / ISO 19650 Model Engine
          </span>
        </div>
        <div className="flex items-center gap-1.5 rounded-md bg-cyan-950/70 border border-cyan-500/30 px-2 py-0.5 text-[10px] text-cyan-300">
          <WifiOff className="w-3 h-3 text-cyan-400" />
          <span>Dexie.js Offline Active</span>
        </div>
      </div>

      {/* Ana Gövde: 3D Soyut İzometrik BIM Tel Kafes (Wireframe Mesh) + Hakediş Blokesi Kartı */}
      <div className="mt-4 grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
        {/* Sol Kolon: 3D Soyut İzometrik Tel Kafes (BIM Wireframe SVG) */}
        <div className="sm:col-span-6 relative flex items-center justify-center p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 overflow-hidden">
          {/* Soyut 3D İzometrik Küp/BIM Mesh Çizimi */}
          <svg
            className="w-full h-36 max-w-[220px]"
            viewBox="0 0 200 160"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            role="img"
            aria-label="3D BIM Yapı Modeli İzometrik Mesh Çizimi"
          >
            {/* Arka Plan Koordinat Izgarası */}
            <path
              d="M20 120 L100 150 L180 120 M100 150 L100 70 M20 120 L100 70 L180 120"
              stroke="rgba(6, 182, 212, 0.2)"
              strokeWidth="1"
              strokeDasharray="3 3"
            />
            {/* 3D Üst Düzlem */}
            <polygon
              points="100,20 160,50 100,80 40,50"
              fill="rgba(6, 182, 212, 0.08)"
              stroke="#06b6d4"
              strokeWidth="1.5"
            />
            {/* 3D Sol Yan Yüz */}
            <polygon
              points="40,50 100,80 100,140 40,110"
              fill="rgba(59, 130, 246, 0.06)"
              stroke="#3b82f6"
              strokeWidth="1.5"
            />
            {/* 3D Sağ Yan Yüz (Hakediş Bloke Alanı: Vurgulu Kırmızı/Zümrüt Kesit) */}
            <polygon
              points="100,80 160,50 160,110 100,140"
              fill="rgba(16, 185, 129, 0.12)"
              stroke="#10b981"
              strokeWidth="1.5"
            />
            {/* 5D BIM Metraj Çakışma Düğümü */}
            <circle cx="100" cy="80" r="4" fill="#06b6d4" className="animate-ping" />
            <circle cx="100" cy="80" r="3" fill="#22d3ee" />
            <circle cx="160" cy="80" r="3" fill="#ef4444" />
            <line x1="100" y1="80" x2="160" y2="80" stroke="#ef4444" strokeWidth="1.5" strokeDasharray="2 2" />
          </svg>

          {/* Dinamik Model Katman Etiketi */}
          <div className="absolute bottom-2 left-2 flex items-center gap-1 text-[9px] text-slate-400 bg-slate-950/80 px-2 py-0.5 rounded border border-slate-800">
            <Box className="w-2.5 h-2.5 text-cyan-400" />
            <span>IFC 4.3 5D Mesh</span>
          </div>
        </div>

        {/* Sağ Kolon: Otomatik Hakediş Bloke Denetim Kartı */}
        <div className="sm:col-span-6 space-y-2.5 text-[11px]">
          <div className="p-2.5 rounded-xl bg-slate-900/70 border border-slate-800">
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Onaylı BIM Hacmi:</span>
              <span className="font-bold text-white">1.250 m³</span>
            </div>
            <div className="flex items-center justify-between mt-1">
              <span className="text-slate-400">Taşeron Beyanı:</span>
              <span className="font-bold text-rose-400">1.480 m³ (+%18.4)</span>
            </div>
            <div className="mt-2 flex items-center gap-1.5 text-[10px] text-rose-300 bg-rose-950/60 border border-rose-500/30 p-1.5 rounded-lg font-sans">
              <AlertTriangle className="w-3.5 h-3.5 shrink-0 text-rose-400" />
              <span>Model Aşımı: Fazla Hakediş Bloke Edildi</span>
            </div>
          </div>

          <div className="p-2 rounded-xl bg-emerald-950/30 border border-emerald-500/20 flex items-center justify-between text-[10px] font-sans">
            <span className="flex items-center gap-1 text-emerald-300">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              YİBF Beton Laboratuvarı:
            </span>
            <span className="font-bold text-white font-mono">C35/45 Onaylı</span>
          </div>
        </div>
      </div>
    </figure>
  );
}

