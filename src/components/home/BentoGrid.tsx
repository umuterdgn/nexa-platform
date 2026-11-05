"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Building2,
  Store,
  UtensilsCrossed,
  Truck,
  Workflow,
  ArrowUpRight,
  WifiOff,
  Sparkles,
} from "lucide-react";

import { ErpBimMockup } from "./ui-mockups/ErpBimMockup";
import { FranchiseKanbanMockup } from "./ui-mockups/FranchiseKanbanMockup";
import { PosFinanceMockup } from "./ui-mockups/PosFinanceMockup";
import { FleetRadarMockup } from "./ui-mockups/FleetRadarMockup";
import { CustomArchitectureMockup } from "./ui-mockups/CustomArchitectureMockup";

/**
 * Apple & Stripe Tarzı Glassmorphism Bento Kartı
 */
function AppleGlassCard({
  children,
  className = "",
  glowColor = "cyan",
}: {
  children: React.ReactNode;
  className?: string;
  glowColor?: "cyan" | "blue" | "emerald" | "amber" | "purple";
}) {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const glowStyles = {
    cyan: "rgba(6, 182, 212, 0.18)",
    blue: "rgba(59, 130, 246, 0.20)",
    emerald: "rgba(16, 185, 129, 0.18)",
    amber: "rgba(245, 158, 11, 0.18)",
    purple: "rgba(147, 51, 234, 0.18)",
  };

  const borderHoverStyles = {
    cyan: "group-hover:border-cyan-500/50 group-hover:shadow-[0_0_40px_rgba(6,182,212,0.18)]",
    blue: "group-hover:border-blue-500/50 group-hover:shadow-[0_0_40px_rgba(59,130,246,0.20)]",
    emerald: "group-hover:border-emerald-500/50 group-hover:shadow-[0_0_40px_rgba(16,185,129,0.18)]",
    amber: "group-hover:border-amber-500/50 group-hover:shadow-[0_0_40px_rgba(245,158,11,0.18)]",
    purple: "group-hover:border-purple-500/50 group-hover:shadow-[0_0_40px_rgba(147,51,234,0.18)]",
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`group relative overflow-hidden rounded-3xl border border-slate-800/80 bg-slate-900/40 p-7 sm:p-9 backdrop-blur-2xl transition-all duration-300 ${borderHoverStyles[glowColor]} ${className}`}
    >
      {/* İnteraktif Hover-Glow Radyal Işık */}
      <div
        className="pointer-events-none absolute -inset-px rounded-3xl transition-opacity duration-300"
        style={{
          opacity: isHovered ? 1 : 0,
          background: `radial-gradient(550px circle at ${mousePos.x}px ${mousePos.y}px, ${glowStyles[glowColor]}, transparent 70%)`,
        }}
      />

      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />
      <div className="relative z-10">{children}</div>
    </motion.article>
  );
}

export function BentoGrid() {
  return (
    <section id="cozumler" className="relative py-28 sm:py-36 overflow-hidden bg-slate-950">
      {/* Koyu Mavi & Elektrik Mavisi Arka Plan */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute top-[20%] left-1/2 -translate-x-1/2 h-[750px] w-[1100px] bg-gradient-to-b from-blue-700/10 via-cyan-500/5 to-transparent blur-[160px]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Bölüm Başlığı (Semantik H2) */}
        <header className="mx-auto max-w-3xl text-center mb-16 sm:mb-24">
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-4 py-1.5 text-xs font-mono font-semibold text-cyan-400">
            <Sparkles className="h-3.5 w-3.5" />
            Nexa Kurumsal Ürün Ekosistemi &bull; Deep-Tech Glassmorphism Vitrini
          </div>
          <h2 className="mt-5 text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.1]">
            Endüstriyel Güçte B2B SaaS,{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-300">
              ERP, POS, IoT ve Lojistik
            </span>
          </h2>
          <p className="mt-5 text-base sm:text-lg text-slate-300 leading-relaxed font-sans">
            Standart stok fotoğrafları yerine; yüksek mühendislikle kodlanmış 3D soyut wireframe modelleri,
            canlı telemetri göstergeleri ve temsili mikro-dashboard arayüzleri.
          </p>
        </header>

        {/* ========================================================
            5 ÜRÜNLÜK APPLE/STRIPE GLASSMORPHISM BENTO GRID VITRINI
           ======================================================== */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-7">

          {/* ========================================================
              1. İNŞAAT VE ŞANTİYE (NEXA ERP) - 8 Kolon
             ======================================================== */}
          <AppleGlassCard className="lg:col-span-8 flex flex-col justify-between" glowColor="emerald">
            <div>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="inline-flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-1.5 text-xs font-mono font-semibold text-emerald-400">
                  <Building2 className="h-4 w-4" />
                  İNŞAAT VE ŞANTİYE &bull; NEXA ERP
                </div>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-cyan-500/40 bg-cyan-500/10 px-3.5 py-1 text-xs font-mono font-bold text-cyan-300">
                  <WifiOff className="h-3.5 w-3.5 text-cyan-400" />
                  %100 Çevrimdışı (Offline-First PWA)
                </span>
              </div>

              <h3 className="mt-6 text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
                İnşaat ve Şantiye (Nexa ERP): Hatalı İmalatta Hakediş Bloke Eden Yazılım
              </h3>

              <p className="mt-3 text-sm sm:text-base text-slate-300 leading-relaxed">
                İnternet olmayan şantiyede hakediş veri girişi sağlayan{" "}
                <strong className="text-white font-semibold">Dexie.js veri senkronizasyonu</strong>,
                taşeron metraj şişirmesini engelleyen program altyapısı ve{" "}
                <strong className="text-emerald-400 font-semibold">3D BIM hakediş blokesi</strong>.
                Türkiye deprem yönetmeliğine uygun şantiye ERP süreçleri, YİBF uyumlu yapı denetim,
                yüksek iskele vinç altı İSG takip için{" "}
                <strong className="text-cyan-400 font-semibold">BLE beacon ve Geofencing</strong> ile
                drone ile 4D dijital ikiz ve AR tesisat kontrolünü tek CDE platformunda sunar.
              </p>

              {/* Temsili Deep-Tech UI: 3D İzometrik BIM Mesh + Hakediş Blokesi Kartı */}
              <ErpBimMockup />
            </div>

            <div className="mt-8 flex items-center justify-between border-t border-slate-800 pt-5">
              <span className="text-xs text-slate-400 font-mono">
                CDE Mimarisi (ISO 19650)
              </span>
              <Link
                href="/urunler/nexa-erp"
                className="inline-flex items-center gap-1.5 text-sm font-bold text-emerald-400 hover:text-emerald-300 transition-colors"
              >
                <span>Nexa ERP Detayları & Satın Al</span>
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
          </AppleGlassCard>

          {/* ========================================================
              2. FRANCHISE & ÇOKLU MAĞAZA YÖNETİMİ - 4 Kolon
             ======================================================== */}
          <AppleGlassCard className="lg:col-span-4 flex flex-col justify-between" glowColor="amber">
            <div>
              <div className="flex items-center justify-between">
                <div className="inline-flex items-center gap-2 rounded-xl border border-amber-500/30 bg-amber-500/10 px-3.5 py-1.5 text-xs font-mono font-semibold text-amber-400">
                  <Store className="h-4 w-4" />
                  FRANCHISE & ROLLOUT
                </div>
                <span className="rounded-full bg-slate-800/80 border border-slate-700 px-2.5 py-0.5 font-mono text-[10px] text-amber-300">
                  Rollout OS
                </span>
              </div>

              <h3 className="mt-6 text-xl sm:text-2xl font-extrabold tracking-tight text-white">
                Franchise & Çoklu Mağaza Yönetimi (Rollout OS)
              </h3>

              <p className="mt-3 text-xs sm:text-sm text-slate-300 leading-relaxed">
                Ana merkezlerin inşaat ve rollout süreçlerini yönetmesi için tasarlanmış modüler yapı:
                Rollout haritası ve Kanban takip, Stage-Gate onay sistemleri, konsept şablonları,
                Punch List (QA) yönetimi, mağaza BIM/3D modelleri ve taşeron sözleşme denetimleri.
              </p>

              {/* Temsili Deep-Tech UI: Kanban Board & Punch List QA Mockup */}
              <FranchiseKanbanMockup />
            </div>

            <div className="mt-8 flex items-center justify-between border-t border-slate-800 pt-5">
              <span className="text-xs text-slate-400 font-mono">Rollout & Royalty OS</span>
              <Link
                href="/urunler/nexa-franchise"
                className="inline-flex items-center gap-1 text-xs font-bold text-amber-400 hover:text-amber-300 transition-colors"
              >
                <span>Nexa Franchise İncele</span>
                <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </AppleGlassCard>

          {/* ========================================================
              3. RESTORAN, CAFE VE PERAKENDE (POS & QR) - 4 Kolon
             ======================================================== */}
          <AppleGlassCard className="lg:col-span-4 flex flex-col justify-between" glowColor="cyan">
            <div>
              <div className="flex items-center justify-between">
                <div className="inline-flex items-center gap-2 rounded-xl border border-cyan-500/30 bg-cyan-500/10 px-3.5 py-1.5 text-xs font-mono font-semibold text-cyan-400">
                  <UtensilsCrossed className="h-4 w-4" />
                  POS & QR EKOSİSTEMİ
                </div>
                <span className="rounded-full bg-slate-800/80 border border-slate-700 px-2.5 py-0.5 font-mono text-[10px] text-cyan-300">
                  STM & Artı POS
                </span>
              </div>

              <h3 className="mt-6 text-xl sm:text-2xl font-extrabold tracking-tight text-white">
                Restoran, Cafe ve Perakende (POS & QR Ekosistemi)
              </h3>

              <p className="mt-3 text-xs sm:text-sm text-slate-300 leading-relaxed">
                STM Yazılım ve Artı POS ile donanım entegrasyonu veya Nexa’nın kendi bağımsız stok/kasa sistemi.
                QR menü garson mutfak entegrasyonu, stoksuz kasa finans otomasyonu, nalbur/toptancı bulut pos sistemi.
              </p>

              {/* Temsili Deep-Tech UI: Ciro Line Chart & QR Kasa Mockup */}
              <PosFinanceMockup />
            </div>

            <div className="mt-8 flex items-center justify-between border-t border-slate-800 pt-5">
              <span className="text-xs text-slate-400 font-mono">Hybrid Cloud POS</span>
              <Link
                href="/urunler/nexa-pos"
                className="inline-flex items-center gap-1 text-xs font-bold text-cyan-400 hover:text-cyan-300 transition-colors"
              >
                <span>Nexa POS Detayları</span>
                <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </AppleGlassCard>

          {/* ========================================================
              4. E-TİCARET VE LOJİSTİK OTOMASYONU - 4 Kolon
             ======================================================== */}
          <AppleGlassCard className="lg:col-span-4 flex flex-col justify-between" glowColor="blue">
            <div>
              <div className="flex items-center justify-between">
                <div className="inline-flex items-center gap-2 rounded-xl border border-blue-500/30 bg-blue-500/10 px-3.5 py-1.5 text-xs font-mono font-semibold text-blue-400">
                  <Truck className="h-4 w-4" />
                  E-TİCARET & LOJİSTİK
                </div>
                <span className="rounded-full bg-slate-800/80 border border-slate-700 px-2.5 py-0.5 font-mono text-[10px] text-blue-300">
                  Headless Commerce
                </span>
              </div>

              <h3 className="mt-6 text-xl sm:text-2xl font-extrabold tracking-tight text-white">
                E-Ticaret ve Lojistik Otomasyonu (API-First)
              </h3>

              <p className="mt-3 text-xs sm:text-sm text-slate-300 leading-relaxed">
                Sektör bağımsız çalışabilen API-first headless e-ticaret altyapısı.
                Tam kapsamlı B2B/B2C e-ticaret otomasyonu, lojistik operasyon ve canlı filo konum izleme ve rota optimizasyonu.
              </p>

              {/* Temsili Deep-Tech UI: Filo GPS Rota Haritası Mockup */}
              <FleetRadarMockup />
            </div>

            <div className="mt-8 flex items-center justify-between border-t border-slate-800 pt-5">
              <span className="text-xs text-slate-400 font-mono">Headless Fleet & Store</span>
              <Link
                href="/urunler/nexa-commerce"
                className="inline-flex items-center gap-1 text-xs font-bold text-blue-400 hover:text-blue-300 transition-colors"
              >
                <span>Nexa Commerce İncele</span>
                <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </AppleGlassCard>

          {/* ========================================================
              5. KURUMSAL ÖZEL YAZILIM VE IOT ÇÖZÜMLERİ - 4 Kolon
             ======================================================== */}
          <AppleGlassCard className="lg:col-span-4 flex flex-col justify-between" glowColor="purple">
            <div>
              <div className="flex items-center justify-between">
                <div className="inline-flex items-center gap-2 rounded-xl border border-purple-500/30 bg-purple-500/10 px-3.5 py-1.5 text-xs font-mono font-semibold text-purple-400">
                  <Workflow className="h-4 w-4" />
                  CUSTOM SAAS & IOT
                </div>
                <span className="rounded-full bg-slate-800/80 border border-slate-700 px-2.5 py-0.5 font-mono text-[10px] text-purple-300">
                  NeonDB & SAP
                </span>
              </div>

              <h3 className="mt-6 text-xl sm:text-2xl font-extrabold tracking-tight text-white">
                Kurumsal Özel Yazılım ve IoT Çözümleri (Custom SaaS)
              </h3>

              <p className="mt-3 text-xs sm:text-sm text-slate-300 leading-relaxed">
                NeonDB (Serverless PostgreSQL), OData, SAP entegrasyonu ve Multi-tenant mimari.
                İşletmeye özel (custom) ERP yazdıran şirketler ve B2B SaaS mimarisi kuran ajanslar için terzi işi yazılım.
              </p>

              {/* Temsili Deep-Tech UI: NeonDB & SAP OData Canlı Köprüsü Mockup */}
              <CustomArchitectureMockup />
            </div>

            <div className="mt-8 flex items-center justify-between border-t border-slate-800 pt-5">
              <span className="text-xs text-slate-400 font-mono">NeonDB Multi-Tenant</span>
              <Link
                href="/urunler/nexa-custom"
                className="inline-flex items-center gap-1 text-xs font-bold text-purple-400 hover:text-purple-300 transition-colors"
              >
                <span>Nexa Custom Detayları</span>
                <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </AppleGlassCard>

        </div>
      </div>
    </section>
  );
}
