"use client";

import React from "react";
import { motion } from "framer-motion";
import { Database, Server, Workflow, Lock, Cpu } from "lucide-react";

/**
 * Nexa Custom & IoT: NeonDB Serverless, SAP OData & Multi-Tenant Temsili Mimari Mockup
 * Kesinlikle stok fotoğraf içermez; mikroservis veri akışı SVG ve izometrik düğüm şeması.
 */
export function CustomArchitectureMockup() {
  return (
    <figure
      role="img"
      aria-label="Nexa Custom Kurumsal Terzi İşi SAP OData Entegrasyonu ve NeonDB Serverless PostgreSQL Temsili Mimarisi"
      className="relative mt-6 overflow-hidden rounded-2xl border border-purple-500/20 bg-slate-950/90 p-4 font-mono text-xs shadow-2xl backdrop-blur-2xl"
    >
      <figcaption className="sr-only">
        Nexa Custom Kurumsal Terzi İşi SAP OData Entegrasyonu ve NeonDB Serverless PostgreSQL Temsili Mimarisi
      </figcaption>

      {/* Üst Bar: Mimari & Entegrasyon Katmanı */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
        <div className="flex items-center gap-1.5">
          <Workflow className="w-3.5 h-3.5 text-purple-400" />
          <span className="text-[11px] font-semibold text-slate-300">
            SAP OData v4 & Edge Router
          </span>
        </div>
        <span className="text-[10px] text-purple-300 bg-purple-950/60 border border-purple-500/30 px-2 py-0.5 rounded font-bold">
          18ms P99 Canlı
        </span>
      </div>

      {/* Temsili Mikroservis Veri Akış Şeması (SVG) */}
      <div className="mt-3 p-3 rounded-xl bg-slate-900/60 border border-slate-800/80">
        <div className="grid grid-cols-3 gap-2 text-center text-[10px]">
          {/* İstemci Katmanı */}
          <div className="p-2 rounded-lg bg-slate-950 border border-slate-800">
            <span className="text-cyan-400 font-bold block">Next.js 16</span>
            <span className="text-[9px] text-slate-500">React Native 60fps</span>
          </div>

          {/* Nexa OData Gateway */}
          <div className="relative p-2 rounded-lg bg-purple-950/40 border border-purple-500/40">
            <span className="text-purple-300 font-bold block">Nexa Gateway</span>
            <span className="text-[9px] text-slate-400">Canlı OData Köprü</span>
            {/* Canlı Veri Akış Sinyali */}
            <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
          </div>

          {/* NeonDB & SAP Çekirdek */}
          <div className="p-2 rounded-lg bg-slate-950 border border-slate-800">
            <span className="text-emerald-400 font-bold block">NeonDB + SAP</span>
            <span className="text-[9px] text-slate-500">Multi-Tenant İzole</span>
          </div>
        </div>

        {/* Canlı Paket Senkronizasyon İlerleme Çubuğu */}
        <div className="mt-3 space-y-1">
          <div className="flex justify-between text-[9px] text-slate-400">
            <span>Senkronizasyon Doğruluğu:</span>
            <span className="text-emerald-400 font-bold">%100 Sıfır Çakışma</span>
          </div>
          <div className="h-1.5 w-full rounded-full bg-slate-950 overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-cyan-500 via-purple-500 to-emerald-400 rounded-full"
              initial={{ width: "20%" }}
              animate={{ width: ["20%", "95%", "100%"] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>
        </div>
      </div>

      {/* Alt Bilgi: Mülkiyet ve IoT Telemetri Güvencesi */}
      <div className="mt-3 pt-2.5 border-t border-slate-800 flex items-center justify-between text-[10px] text-slate-400">
        <span className="flex items-center gap-1">
          <Lock className="w-3 h-3 text-cyan-400" />
          Fikri Mülkiyet: <strong className="text-white">%100 Kurumunuza Ait</strong>
        </span>
        <span className="text-purple-300 flex items-center gap-1 font-mono">
          <Cpu className="w-3 h-3" />
          IoT Telemetri
        </span>
      </div>
    </figure>
  );
}

