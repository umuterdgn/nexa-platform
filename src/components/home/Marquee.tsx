"use client";

import { motion } from "framer-motion";
import { 
  Building2, 
  Cpu, 
  Layers, 
  Globe2, 
  ShieldCheck, 
  Boxes, 
  Atom, 
  Compass, 
  BarChart3, 
  GraduationCap, 
  Factory, 
  Zap 
} from "lucide-react";

const companies = [
  { name: "Atlas Global", sub: "Logistics", icon: Globe2 },
  { name: "Vanguard Yapı", sub: "Gayrimenkul", icon: Building2 },
  { name: "Zenith Retail", sub: "Omnichannel", icon: Boxes },
  { name: "Nova Holding", sub: "Industrial", icon: Layers },
  { name: "Kuantum Sağlık", sub: "HealthTech", icon: Atom },
  { name: "Apex İnşaat", sub: "Engineering", icon: Compass },
  { name: "Nordic Cloud", sub: "Infrastructure", icon: Cpu },
  { name: "Aura Finans", sub: "Capital", icon: BarChart3 },
  { name: "Vektör Filo", sub: "Fleet Logistics", icon: ShieldCheck },
  { name: "Simya Eğitim", sub: "EdTech", icon: GraduationCap },
  { name: "Metrik OS", sub: "Automation", icon: Factory },
  { name: "Boreal Enerji", sub: "CleanTech", icon: Zap },
];

export function Marquee() {
  // Duplicate array for seamless infinite scroll loop
  const marqueeItems = [...companies, ...companies];

  return (
    <section className="relative border-y border-slate-800/80 bg-slate-950/80 py-12 overflow-hidden">
      {/* Background Accent Mesh */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-cyan-500/[0.02] via-blue-600/[0.03] to-cyan-500/[0.02]" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3.5 py-1 text-[11px] font-mono uppercase tracking-widest text-cyan-400">
            Endüstriyel Güven & Kurumsal Altyapı
          </div>
          <h3 className="mt-3 text-xl sm:text-2xl font-bold tracking-tight text-white">
            Sektörün Öncüleri Tarafından Test Edildi ve Onaylandı
          </h3>
        </div>
      </div>

      {/* Infinite Scrolling Track with Gradient Masking on Edges */}
      <div className="relative w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]">
        <motion.div
          className="flex gap-8 sm:gap-12 w-max py-2"
          animate={{
            x: ["0%", "-50%"],
          }}
          transition={{
            duration: 32,
            repeat: Infinity,
            ease: "linear",
          }}
          whileHover={{ animationPlayState: "paused" }}
        >
          {marqueeItems.map((comp, idx) => {
            const Icon = comp.icon;
            return (
              <div
                key={`${comp.name}-${idx}`}
                className="group flex items-center gap-3.5 rounded-xl border border-white/[0.06] bg-zinc-900/30 px-5 py-3.5 backdrop-blur-md transition-all duration-300 hover:border-emerald-500/40 hover:bg-zinc-900/70 hover:shadow-[0_0_20px_rgba(16,185,129,0.15)]"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/[0.04] text-zinc-400 transition-colors duration-300 group-hover:bg-emerald-500/10 group-hover:text-emerald-400">
                  <Icon className="h-4 w-4" />
                </div>
                <div className="flex flex-col text-left">
                  <span className="font-display text-sm font-semibold text-zinc-300 tracking-tight transition-colors duration-300 group-hover:text-white">
                    {comp.name}
                  </span>
                  <span className="font-mono text-[10px] text-zinc-400 tracking-wider uppercase">
                    {comp.sub}
                  </span>
                </div>
              </div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
