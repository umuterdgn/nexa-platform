"use client";

import React from "react";
import { CheckCircle2, Clock, FileCheck2, ShieldCheck, ChevronRight } from "lucide-react";

/**
 * Nexa Franchise: Çoklu Mağaza Rollout, Kanban ve Punch List QA Temsili UI Mockup
 * Kesinlikle stok fotoğraf içermez; saf Glassmorphism, Tailwind ve soyut kartlar.
 */
export function FranchiseKanbanMockup() {
  return (
    <figure
      role="img"
      aria-label="Nexa Franchise Çoklu Mağaza Rollout Haritası, Kanban Takip ve Punch List QA Temsili Dashboard"
      className="relative mt-6 overflow-hidden rounded-2xl border border-amber-500/20 bg-slate-950/90 p-4 font-mono text-xs shadow-2xl backdrop-blur-2xl"
    >
      <figcaption className="sr-only">
        Nexa Franchise Çoklu Mağaza Rollout Haritası, Kanban Takip ve Punch List QA Temsili Dashboard
      </figcaption>

      {/* Üst Bar: Stage-Gate İlerleme Çizelgesi */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
        <span className="text-[11px] font-semibold text-slate-300 flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-amber-400" />
          Kadıköy Şubesi &bull; Rollout Stage 3
        </span>
        <span className="text-[10px] text-amber-400 bg-amber-950/60 border border-amber-500/30 px-2 py-0.5 rounded font-bold">
          Stage-Gate Onaylandı
        </span>
      </div>

      {/* Mini Temsili Kanban Bordu (3 Kolon) */}
      <div className="mt-3.5 grid grid-cols-3 gap-2 text-[10px]">
        {/* Kolon 1: Konsept & 3D Tasarım */}
        <div className="p-2 rounded-xl bg-slate-900/60 border border-slate-800/80 space-y-1.5">
          <span className="text-slate-500 font-bold block text-[9px] uppercase">
            1. Konsept (BIM)
          </span>
          <div className="p-1.5 rounded-lg bg-slate-950/80 border border-slate-800 text-slate-300">
            <span className="font-semibold block text-white text-[10px]">Mimari 3D</span>
            <span className="text-[9px] text-emerald-400 flex items-center gap-0.5 mt-0.5">
              <CheckCircle2 className="w-2.5 h-2.5" /> Onaylandı
            </span>
          </div>
        </div>

        {/* Kolon 2: Punch List (QA) */}
        <div className="p-2 rounded-xl bg-slate-900/60 border border-amber-500/30 bg-amber-950/10 space-y-1.5">
          <span className="text-amber-400 font-bold block text-[9px] uppercase">
            2. Punch List (QA)
          </span>
          <div className="p-1.5 rounded-lg bg-slate-950/80 border border-amber-500/30 text-slate-200">
            <span className="font-semibold block text-[10px]">Taşeron Eksik</span>
            <span className="text-[9px] text-amber-300">2 / 14 Kaldı</span>
          </div>
        </div>

        {/* Kolon 3: Açılış & Ruhsat */}
        <div className="p-2 rounded-xl bg-slate-900/60 border border-slate-800/80 space-y-1.5">
          <span className="text-slate-500 font-bold block text-[9px] uppercase">
            3. Canlı / Royalty
          </span>
          <div className="p-1.5 rounded-lg bg-slate-950/80 border border-slate-800 text-slate-400">
            <span className="font-semibold block text-slate-300 text-[10px]">Ciro Payı</span>
            <span className="text-[9px] text-cyan-400 font-bold">%4.5 Royalty</span>
          </div>
        </div>
      </div>

      {/* Alt Bilgi: Konsolide RMA & Gizli Müşteri Puanı */}
      <div className="mt-3 pt-2.5 border-t border-slate-800 flex items-center justify-between text-[10px] text-slate-400">
        <span className="flex items-center gap-1">
          <ShieldCheck className="w-3 h-3 text-emerald-400" />
          Gizli Müşteri Skoru: <strong className="text-white">96.4/100</strong>
        </span>
        <span className="text-amber-400 flex items-center">
          RMA Takip <ChevronRight className="w-3 h-3" />
        </span>
      </div>
    </figure>
  );
}

