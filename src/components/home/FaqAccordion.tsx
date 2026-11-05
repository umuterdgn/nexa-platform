"use client";

import { useState } from "react";
import { HelpCircle, ChevronDown, Sparkles } from "lucide-react";
import { faqData } from "./faqData";

/**
 * Semantik HTML (<details> ve <summary>) ile kodlanmış,
 * LLM ve Arama Motorlarının (ChatGPT, Gemini, Google SGE) doğrudan parse edebileceği B2B SSS Bileşeni.
 */
export function FaqAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section
      id="sss"
      className="relative py-24 sm:py-32 overflow-hidden border-t border-slate-800/80 bg-slate-950"
    >
      {/* Koyu Mavi & Elektrik Mavisi Ambiyans */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute bottom-0 right-1/4 h-[500px] w-[500px] bg-cyan-500/[0.04] blur-[150px]" />
        <div className="absolute top-1/3 left-1/4 h-[400px] w-[400px] bg-blue-600/[0.05] blur-[140px]" />
      </div>

      <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* Başlık Alanı (H2) */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3.5 py-1 text-xs font-mono font-semibold text-cyan-400">
            <HelpCircle className="h-3.5 w-3.5" />
            C-Level & Mühendislik Karar Verici Rehberi
          </div>

          <h2 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white">
            Sıkça Sorulan Sorular ve Teknik Yetkinlikler
          </h2>

          <p className="mt-4 text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl mx-auto">
            Özel yazılım süreçlerimiz, çevrimdışı şantiye ERP mimarimiz, 5D BIM
            hakediş blokesi ve kurumsal SAP entegrasyonlarımız hakkında net teknik
            yanıtlar.
          </p>
        </div>

        {/* Semantik <details> / <summary> Listesi */}
        <div className="space-y-4">
          {faqData.map((item, idx) => {
            const isOpen = openIndex === idx;

            return (
              <details
                key={idx}
                open={isOpen}
                onToggle={(e) => {
                  const target = e.currentTarget as HTMLDetailsElement;
                  if (target.open) {
                    setOpenIndex(idx);
                  } else if (openIndex === idx) {
                    setOpenIndex(null);
                  }
                }}
                className={`group rounded-2xl border transition-all duration-300 backdrop-blur-xl ${
                  isOpen
                    ? "border-cyan-500/40 bg-slate-900/80 shadow-[0_0_30px_rgba(6,182,212,0.12)]"
                    : "border-slate-800/80 bg-slate-900/40 hover:border-slate-700 hover:bg-slate-900/60"
                }`}
              >
                <summary className="flex cursor-pointer list-none items-center justify-between p-6 sm:p-7 text-left transition-colors focus:outline-none">
                  <div className="flex items-start gap-4 sm:gap-5 pr-4">
                    <span
                      className={`font-mono text-xs sm:text-sm font-bold tracking-wider pt-0.5 transition-colors ${
                        isOpen ? "text-cyan-400" : "text-slate-500"
                      }`}
                    >
                      0{idx + 1}
                    </span>
                    <div>
                      {item.category && (
                        <span className="block text-[11px] font-mono uppercase tracking-wider text-cyan-400/80 mb-1">
                          {item.category}
                        </span>
                      )}
                      <h3 className="text-base sm:text-lg font-bold text-white leading-snug">
                        {item.question}
                      </h3>
                    </div>
                  </div>

                  <div
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border transition-all duration-300 ${
                      isOpen
                        ? "border-cyan-500/40 bg-cyan-500/10 text-cyan-400 rotate-180"
                        : "border-slate-800 bg-slate-800/60 text-slate-400 group-hover:text-white"
                    }`}
                  >
                    <ChevronDown className="h-4 w-4" />
                  </div>
                </summary>

                <div className="px-6 pb-6 sm:px-7 sm:pb-7 pt-2 border-t border-slate-800/50">
                  <p className="text-sm sm:text-base text-slate-300 leading-relaxed pl-7 sm:pl-9">
                    {item.answer}
                  </p>
                </div>
              </details>
            );
          })}
        </div>

        {/* Alt Bilgi Kutusu */}
        <div className="mt-12 text-center p-6 rounded-2xl bg-gradient-to-r from-slate-900/90 via-blue-950/30 to-slate-900/90 border border-cyan-500/20">
          <p className="text-xs sm:text-sm text-slate-300">
            Aradığınız sorunun cevabını bulamadınız mı? Doğrudan kurucu ve baş mühendisimizle{" "}
            <strong className="text-white">strateji toplantısı</strong> planlayarak mimarinizi masaya yatırabilirsiniz.
          </p>
        </div>
      </div>
    </section>
  );
}
