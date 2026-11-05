"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Zap, ArrowRight, ShieldCheck, Clock, FileCode } from "lucide-react";
import { openStrategyCallModal } from "@/lib/modal-events";

export function CtaSection() {
  return (
    <section className="relative py-24 sm:py-32 overflow-hidden bg-slate-950">
      {/* Background Ambient Glow */}
      <div className="pointer-events-none absolute inset-0 -z-10 flex items-center justify-center">
        <div className="h-[450px] w-[750px] rounded-full bg-gradient-to-r from-cyan-500/10 via-blue-600/15 to-cyan-500/10 blur-[140px]" />
      </div>

      <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="relative overflow-hidden rounded-3xl border border-slate-800 bg-gradient-to-b from-slate-900/90 via-slate-900/50 to-slate-950 p-8 sm:p-14 text-center shadow-2xl backdrop-blur-2xl"
        >
          {/* Subtle Grid in CTA Card */}
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:3rem_3rem]" />

          <div className="relative mx-auto max-w-3xl">
            {/* Pill */}
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-4 py-1.5 text-xs font-mono font-semibold text-cyan-400">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-400" />
              </span>
              48 SAAT İÇİNDE MİMARİ VE YOL HARİTASI
            </div>

            <h2 className="mt-6 text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-[1.15]">
              İşletmenizin Dijital İkizini{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-300 to-indigo-300">
                Bugün Birlikte Kodlayalım
              </span>
            </h2>

            <p className="mt-5 text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl mx-auto">
              48 saat içinde projenizin teknik mimarisini, Dexie.js offline-first veya SAP entegrasyon fizibilitesini hazırlayalım.
            </p>

            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <button
                type="button"
                onClick={() => openStrategyCallModal()}
                className="group inline-flex items-center justify-center gap-2.5 rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-600 to-blue-700 px-8 py-4 text-sm font-bold text-white shadow-xl shadow-cyan-500/25 transition-all duration-300 hover:from-cyan-400 hover:to-blue-600 hover:shadow-cyan-500/40 hover:-translate-y-0.5 cursor-pointer"
              >
                <Zap className="h-4 w-4 text-white transition-transform group-hover:scale-110" />
                <span>Strateji Toplantısı Planla (Google Meet)</span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </button>

              <Link
                href="/teklif-al"
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-800 bg-slate-900/80 px-8 py-4 text-sm font-semibold text-slate-200 backdrop-blur-xl transition hover:border-cyan-500/40 hover:bg-slate-800 active:scale-95"
              >
                Projenizi Planlayalım (48 Saat)
              </Link>
            </div>

            {/* Security & Delivery Commitments */}
            <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-4 pt-8 border-t border-slate-800 text-left">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                  <Clock className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-white">48 Saat Mimari Rapor</h4>
                  <p className="text-[11px] text-slate-400">Kapsamlı teknik analiz ve yol haritası</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                  <FileCode className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-white">%100 Kod & IP Devri</h4>
                  <p className="text-[11px] text-slate-400">Lisans kilidi yok, tüm mülkiyet sizin</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                  <ShieldCheck className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-white">SLA & Kurumsal Güvence</h4>
                  <p className="text-[11px] text-slate-400">%99.99 çalışma ve 7/24 kritik destek</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
