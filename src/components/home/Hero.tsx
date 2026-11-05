"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, ShieldCheck, Zap, Calendar, Cpu, Layers, CheckCircle2 } from "lucide-react";
import { openStrategyCallModal } from "@/lib/modal-events";

export function Hero() {
  return (
    <section className="relative min-h-[92vh] flex items-center justify-center overflow-hidden pt-16 pb-20 sm:pt-24 sm:pb-28 bg-slate-950">
      {/* Dynamic Animated Ambient Background (Koyu Mavi Gradient + Elektrik Mavisi Orblar + Cyber Grid) */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        {/* Subtle Cyber Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_40%,#000_70%,transparent_100%)]" />

        {/* Elektrik Mavisi (Cyan) Hareketli Orb */}
        <motion.div
          animate={{
            x: [0, 40, -30, 0],
            y: [0, -50, 20, 0],
            scale: [1, 1.15, 0.95, 1],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute -top-[10%] left-[15%] h-[520px] w-[520px] rounded-full bg-cyan-500/15 blur-[130px]"
        />

        {/* Koyu Kobalt Mavi Hareketli Orb */}
        <motion.div
          animate={{
            x: [0, -50, 40, 0],
            y: [0, 40, -30, 0],
            scale: [1, 1.2, 0.9, 1],
          }}
          transition={{
            duration: 22,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-[20%] right-[10%] h-[550px] w-[550px] rounded-full bg-blue-600/15 blur-[140px]"
        />

        {/* Merkez Odaklı Derin Radyal Gradient */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[650px] w-[850px] bg-gradient-to-b from-cyan-500/10 via-blue-700/5 to-transparent blur-[160px]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full">
        <div className="mx-auto max-w-4xl text-center">
          {/* Mühendislik & Güven Rozeti */}
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="inline-flex items-center gap-2.5 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-4 py-1.5 backdrop-blur-md shadow-[0_0_20px_rgba(6,182,212,0.2)]"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-400" />
            </span>
            <span className="text-xs font-semibold tracking-wide text-cyan-300 uppercase font-mono">
              Nexa Kurumsal Mühendislik &bull; Otonom SaaS Ekosistemleri
            </span>
          </motion.div>

          {/* H1 Başlık (Sayfada Kesinlikle Tek Bir Tane: Nexa Global - Otonom B2B SaaS Çözümleri) */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="mt-8 text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.1]"
          >
            Nexa Global &bull;{" "}
            <span className="block mt-3 text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-200 to-blue-400 drop-shadow-[0_0_35px_rgba(6,182,212,0.3)]">
              Otonom B2B SaaS Çözümleri
            </span>
          </motion.h1>

          {/* H2 Alt Başlık */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="mx-auto mt-7 max-w-3xl text-base sm:text-xl font-normal text-slate-300 leading-relaxed font-sans"
          >
            İnşaat ve şantiye için %100 çevrimdışı 3D BIM mimarili{" "}
            <strong className="text-white font-semibold">Nexa ERP</strong>, çoklu mağaza rollout OS{" "}
            <strong className="text-cyan-300 font-semibold">Nexa Franchise</strong>, hibrit bulut{" "}
            <strong className="text-blue-300 font-semibold">Nexa POS</strong>, filo lojistiği ve SAP/OData entegre terzi işi kurumsal yazılım mühendisliği.
          </motion.h2>

          {/* CTA Butonları */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-4"
          >
            {/* Birincil Buton: Strateji Toplantısı Planla (Calendly Entegrasyonlu) */}
            <button
              type="button"
              onClick={() => openStrategyCallModal()}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-600 to-blue-700 px-8 py-4 text-sm font-bold text-white shadow-xl shadow-cyan-500/25 transition-all duration-300 hover:from-cyan-400 hover:to-blue-600 hover:shadow-cyan-500/40 hover:-translate-y-0.5 cursor-pointer"
            >
              <Calendar className="h-4 w-4" />
              <span>Strateji Toplantısı Planla</span>
              <ArrowRight className="h-4 w-4" />
            </button>

            {/* İkincil Buton: Nexa ERP & Çözümler */}
            <Link
              href="/urunler/nexa-erp"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-800 bg-slate-900/80 px-8 py-4 text-sm font-semibold text-slate-200 backdrop-blur-xl transition-all duration-300 hover:border-cyan-500/40 hover:bg-slate-900 hover:text-white"
            >
              <span>Nexa ERP (Çevrimdışı PWA & 5D BIM)</span>
            </Link>
          </motion.div>

          {/* Güven ve Uyumluluk Maddeleri (Semantik <ul>/<li>) */}
          <motion.ul
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="mt-12 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs text-slate-400 border-t border-slate-900 pt-8"
          >
            <li className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-cyan-400" />
              <span>Dexie.js Destekli %100 Çevrimdışı PWA</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-cyan-400" />
              <span>SAP & OData Çift Yönlü Entegrasyon</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-cyan-400" />
              <span>%100 Kod & IP Fikri Mülkiyet Garantisi</span>
            </li>
          </motion.ul>
        </div>
      </div>
    </section>
  );
}
