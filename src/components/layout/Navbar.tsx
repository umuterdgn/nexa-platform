"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Menu,
  X,
  ChevronDown,
  Search,
  Building,
  CalendarCheck,
  GraduationCap,
  Layers,
  ShoppingBag,
  Smartphone,
  BookOpen,
  FileCode2,
  HelpCircle,
  Video,
  LayoutDashboard,
  Sparkles,
  ArrowRight,
  TrendingDown,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useSession, signOut } from "next-auth/react";
import { openStrategyCallModal, openCommandPalette } from "@/lib/modal-events";

interface MegaItem {
  title: string;
  desc: string;
  href: string;
  icon: any;
  badge?: string;
}

const PRODUCTS_MENU: MegaItem[] = [
  {
    title: "Nexa ERP",
    desc: "İnşaat ve Şantiye: Dexie.js Çevrimdışı PWA & 3D BIM Hakediş Blokesi",
    href: "/urunler/nexa-erp",
    icon: Building,
    badge: "BIM & CDE",
  },
  {
    title: "Nexa Franchise",
    desc: "Çoklu Mağaza Rollout, Stage-Gate Onay & Punch List (QA) Yönetimi",
    href: "/urunler/nexa-franchise",
    icon: Layers,
    badge: "Rollout OS",
  },
  {
    title: "Nexa POS & Kasa",
    desc: "STM & Artı POS Uyumlu, QR Menü & Nalbur/Cafe Bulut Kasa",
    href: "/urunler/nexa-pos",
    icon: ShoppingBag,
    badge: "POS & QR",
  },
  {
    title: "Nexa Commerce",
    desc: "API-First Headless E-Ticaret & Canlı Filo GPS Rota Optimizasyonu",
    href: "/urunler/nexa-commerce",
    icon: Layers,
    badge: "Lojistik",
  },
  {
    title: "Nexa Custom & IoT",
    desc: "NeonDB Serverless PG, SAP & OData Entegreli Terzi İşi Mimari",
    href: "/urunler/nexa-custom",
    icon: Layers,
    badge: "Custom SaaS",
  },
];

const SOLUTIONS_MENU: MegaItem[] = [
  {
    title: "İnşaat & Şantiye Yönetimi",
    desc: "Hakediş hesaplama, taşeron ve malzeme akışını tek merkezde birleştirin",
    href: "/cozumler#insaat",
    icon: Layers,
  },
  {
    title: "Perakende & Çok Şubeli Sistemler",
    desc: "Merkezi kasa, randevu ve stok senkronizasyonu",
    href: "/cozumler#perakende",
    icon: ShoppingBag,
  },
  {
    title: "Özel (Custom) Kurumsal Mobil Uygulamalar",
    desc: "iOS & Android sıfırdan mimarilendirilmiş yüksek performanslı çözümler",
    href: "/cozumler#custom",
    icon: Smartphone,
    badge: "-%40 Maliyet",
  },
];

const RESOURCES_MENU: MegaItem[] = [
  {
    title: "B2B SaaS Sözlüğü",
    desc: "Headless ERP, multi-tenancy, SLA ve dağıtık mimari terimleri",
    href: "/kaynaklar#sozluk",
    icon: BookOpen,
  },
  {
    title: "API Dokümantasyonu & Entegrasyon",
    desc: "SAP, Logo ve Mikro için REST & Webhook mimari rehberleri",
    href: "/kaynaklar#api",
    icon: FileCode2,
  },
  {
    title: "Yönetici SSS (CEO Rehberi)",
    desc: "Veri mülkiyeti, KVKK, mimari standartlar ve teknik garanti",
    href: "/kaynaklar#sss",
    icon: HelpCircle,
  },
];

export function Navbar() {
  const pathname = usePathname();
  const [openMobile, setOpenMobile] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const dropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const { data: session, status } = useSession();
  const isLoggedIn = status === "authenticated";
  const isAdmin = session?.user?.role === "admin";
  const isLoading = status === "loading";

  const handleMouseEnter = (menuName: string) => {
    if (dropdownTimeoutRef.current) clearTimeout(dropdownTimeoutRef.current);
    setActiveDropdown(menuName);
  };

  const handleMouseLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 150);
  };

  useEffect(() => {
    setActiveDropdown(null);
    setOpenMobile(false);
  }, [pathname]);

  if (pathname?.startsWith("/admin")) {
    return null;
  }

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/[0.08] bg-zinc-950/85 backdrop-blur-xl">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <div className="flex items-center gap-8">
          <Link
            href="/"
            className="font-display text-xl font-bold tracking-tight flex items-center gap-2.5 group"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono text-sm font-extrabold shadow-[0_0_15px_rgba(16,185,129,0.25)] group-hover:shadow-[0_0_20px_rgba(16,185,129,0.5)] group-hover:border-emerald-400 transition-all">
              N
            </div>
            <span className="text-white font-semibold tracking-tight">
              Nexa<span className="text-emerald-400 font-bold">.</span>
            </span>
            <span className="hidden sm:inline-flex items-center rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-400">
              Enterprise
            </span>
          </Link>

          {/* Desktop Navigation Links & Mega Menus */}
          <ul className="hidden items-center gap-1 lg:flex">
            {/* 1. Ürünler (Mega Menu) */}
            <li
              className="relative"
              onMouseEnter={() => handleMouseEnter("urunler")}
              onMouseLeave={handleMouseLeave}
            >
              <Link
                href="/urunler"
                className={cn(
                  "flex items-center gap-1 px-3 py-2 text-sm font-medium transition-colors hover:text-white rounded-lg",
                  pathname.startsWith("/urunler") ? "text-emerald-400" : "text-zinc-300",
                )}
              >
                <span>Ürünler</span>
                <ChevronDown
                  className={cn(
                    "h-3.5 w-3.5 transition-transform duration-200",
                    activeDropdown === "urunler" && "rotate-180 text-cyan-400",
                  )}
                />
              </Link>

              {activeDropdown === "urunler" && (
                <div className="absolute top-full left-0 w-[420px] pt-2">
                  <div className="rounded-2xl border border-slate-800 bg-slate-950/95 p-4 shadow-2xl backdrop-blur-2xl">
                    <div className="px-2 pb-2 text-[11px] font-mono uppercase tracking-wider text-slate-400">
                      Nexa SaaS Ekosistemi
                    </div>
                    <div className="space-y-1">
                      {PRODUCTS_MENU.map((item) => {
                        const Icon = item.icon;
                        return (
                          <Link
                            key={item.title}
                            href={item.href}
                            className="flex items-start gap-3 rounded-xl p-2.5 transition-colors hover:bg-slate-900 group"
                          >
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 group-hover:border-cyan-500/40">
                              <Icon className="h-4 w-4" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-semibold text-white group-hover:text-cyan-300">
                                  {item.title}
                                </span>
                                {item.badge && (
                                  <span className="rounded bg-cyan-500/10 border border-cyan-500/20 px-1.5 py-0.2 text-[10px] font-mono text-cyan-400">
                                    {item.badge}
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">
                                {item.desc}
                              </p>
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                    <div className="mt-2 border-t border-slate-800 pt-2.5 px-2">
                      <Link
                        href="/urunler/nexa-erp"
                        className="flex items-center justify-between text-xs font-semibold text-cyan-400 hover:text-cyan-300"
                      >
                        <span>Nexa ERP (Çevrimdışı PWA & 5D BIM) İnceleyin</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </li>

            {/* 2. Çözümler (Mega Menu) */}
            <li
              className="relative"
              onMouseEnter={() => handleMouseEnter("cozumler")}
              onMouseLeave={handleMouseLeave}
            >
              <Link
                href="/cozumler"
                className={cn(
                  "flex items-center gap-1 px-3 py-2 text-sm font-medium transition-colors hover:text-white rounded-lg",
                  pathname.startsWith("/cozumler") ? "text-emerald-400" : "text-zinc-300",
                )}
              >
                <span>Çözümler</span>
                <ChevronDown
                  className={cn(
                    "h-3.5 w-3.5 transition-transform duration-200",
                    activeDropdown === "cozumler" && "rotate-180 text-emerald-400",
                  )}
                />
              </Link>

              {activeDropdown === "cozumler" && (
                <div className="absolute top-full left-0 w-[450px] pt-2">
                  <div className="rounded-2xl border border-white/10 bg-zinc-950/95 p-4 shadow-2xl backdrop-blur-2xl">
                    <div className="px-2 pb-2 text-[11px] font-mono uppercase tracking-wider text-zinc-400">
                      Sektörel & Kurumsal Mühendislik
                    </div>
                    <div className="space-y-1">
                      {SOLUTIONS_MENU.map((item) => {
                        const Icon = item.icon;
                        return (
                          <Link
                            key={item.title}
                            href={item.href}
                            className="flex items-start gap-3 rounded-xl p-2.5 transition-colors hover:bg-zinc-900 group"
                          >
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 group-hover:border-blue-500/40">
                              <Icon className="h-4 w-4" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-semibold text-white group-hover:text-blue-300">
                                  {item.title}
                                </span>
                                {item.badge && (
                                  <span className="rounded bg-emerald-500/10 border border-emerald-500/20 px-1.5 py-0.2 text-[10px] font-mono text-emerald-400 font-bold">
                                    {item.badge}
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-zinc-400 mt-0.5 line-clamp-1">
                                {item.desc}
                              </p>
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                    <div className="mt-2.5 border-t border-white/[0.06] pt-2.5 px-2 bg-emerald-500/[0.04] rounded-lg p-2 border border-emerald-500/20">
                      <Link
                        href="/cozumler#roi-calculator"
                        className="flex items-center justify-between text-xs font-semibold text-emerald-400 hover:text-emerald-300"
                      >
                        <span className="flex items-center gap-1.5">
                          <TrendingDown className="h-3.5 w-3.5" />
                          ROI Hesaplayıcı: Tasarruf Simülasyonu Yapın
                        </span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </li>

            {/* 3. Başarı Hikayeleri (Direct Link) */}
            <li>
              <Link
                href="/basari-hikayeleri"
                className={cn(
                  "px-3 py-2 text-sm font-medium transition-colors hover:text-white rounded-lg",
                  pathname === "/basari-hikayeleri" ? "text-emerald-400" : "text-zinc-300",
                )}
              >
                Başarı Hikayeleri
              </Link>
            </li>

            {/* 4. Kaynaklar (Mega Menu) */}
            <li
              className="relative"
              onMouseEnter={() => handleMouseEnter("kaynaklar")}
              onMouseLeave={handleMouseLeave}
            >
              <Link
                href="/kaynaklar"
                className={cn(
                  "flex items-center gap-1 px-3 py-2 text-sm font-medium transition-colors hover:text-white rounded-lg",
                  pathname.startsWith("/kaynaklar") ? "text-emerald-400" : "text-zinc-300",
                )}
              >
                <span>Kaynaklar</span>
                <ChevronDown
                  className={cn(
                    "h-3.5 w-3.5 transition-transform duration-200",
                    activeDropdown === "kaynaklar" && "rotate-180 text-emerald-400",
                  )}
                />
              </Link>

              {activeDropdown === "kaynaklar" && (
                <div className="absolute top-full left-0 w-[420px] pt-2">
                  <div className="rounded-2xl border border-white/10 bg-zinc-950/95 p-4 shadow-2xl backdrop-blur-2xl">
                    <div className="px-2 pb-2 text-[11px] font-mono uppercase tracking-wider text-zinc-400">
                      Teknik Bilgi Bankası
                    </div>
                    <div className="space-y-1">
                      {RESOURCES_MENU.map((item) => {
                        const Icon = item.icon;
                        return (
                          <Link
                            key={item.title}
                            href={item.href}
                            className="flex items-start gap-3 rounded-xl p-2.5 transition-colors hover:bg-zinc-900 group"
                          >
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 group-hover:border-cyan-500/40">
                              <Icon className="h-4 w-4" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <span className="text-sm font-semibold text-white group-hover:text-cyan-300">
                                {item.title}
                              </span>
                              <p className="text-xs text-zinc-400 mt-0.5 line-clamp-1">
                                {item.desc}
                              </p>
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </li>

            {/* 5. Manifesto (Direct Link) */}
            <li>
              <Link
                href="/manifesto"
                className={cn(
                  "flex items-center gap-1.5 px-3 py-2 text-sm font-medium transition-colors hover:text-white rounded-lg",
                  pathname === "/manifesto" ? "text-emerald-400 font-semibold" : "text-zinc-300",
                )}
              >
                <span>Manifesto</span>
                <span className="rounded bg-white/[0.06] border border-white/10 px-1.5 py-0.2 text-[9px] font-mono text-zinc-400">
                  Culture
                </span>
              </Link>
            </li>
          </ul>
        </div>

        {/* Right Action Area */}
        <div className="hidden items-center gap-3 sm:flex">
          {/* Global Command Palette Trigger Button (Cmd + K) */}
          <button
            type="button"
            onClick={() => openCommandPalette()}
            className="flex items-center gap-2 rounded-lg border border-white/10 bg-zinc-900/60 px-2.5 py-1.5 text-xs text-zinc-400 hover:border-white/25 hover:text-white transition-all shadow-sm"
            aria-label="Arama ve Komut Paleti (Ctrl+K)"
          >
            <Search className="h-3.5 w-3.5 text-emerald-400" />
            <span className="hidden xl:inline">Hızlı Arama</span>
            <kbd className="rounded bg-zinc-800 px-1.5 py-0.5 font-mono text-[10px] text-zinc-300 border border-white/5">
              ⌘K
            </kbd>
          </button>

          {/* User Auth or Strategy Call CTA */}
          {isLoading ? (
            <div className="h-9 w-24 animate-pulse rounded-lg bg-zinc-800/50" />
          ) : isLoggedIn ? (
            <div className="flex items-center gap-3">
              {isAdmin && (
                <Link
                  href="/admin"
                  className="flex items-center gap-1.5 text-xs font-semibold text-blue-400 hover:text-blue-300"
                >
                  <LayoutDashboard size={14} />
                  Admin
                </Link>
              )}
              <Link
                href="/profil"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-cyan-500/30 bg-cyan-500/10 text-xs font-mono font-bold text-cyan-300 hover:bg-cyan-500 hover:text-slate-950 transition"
              >
                <LayoutDashboard size={14} />
                <span>Müşteri Portalı</span>
              </Link>
              <button
                onClick={() => signOut({ callbackUrl: "/auth/login" })}
                className="rounded border border-red-500/20 bg-red-500/5 px-2.5 py-1 text-xs text-red-400 hover:bg-red-500 hover:text-white transition-all"
              >
                Çıkış
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2.5">
              <Link
                href="/auth/login"
                className="flex items-center gap-1 text-xs font-mono font-medium text-slate-300 hover:text-cyan-300 px-2.5 py-1.5 rounded-lg border border-slate-800 hover:border-slate-700 transition"
              >
                <span>Müşteri Girişi</span>
              </Link>

              {/* Conversion Funnel CTA: Strateji Toplantısı Planla */}
              <button
                type="button"
                onClick={() => openStrategyCallModal()}
                className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-blue-700 px-4 py-2 text-xs font-bold text-white shadow-[0_0_20px_rgba(6,182,212,0.35)] transition-all hover:shadow-[0_0_25px_rgba(6,182,212,0.55)] hover:scale-[1.02] active:scale-95 cursor-pointer"
              >
                <Video className="h-3.5 w-3.5" />
                <span>Strateji Toplantısı Planla</span>
              </button>
            </div>
          )}
        </div>

        {/* Mobile Hamburger Button */}
        <div className="flex items-center gap-2 lg:hidden">
          <button
            type="button"
            onClick={() => openCommandPalette()}
            className="p-2 text-zinc-400 hover:text-white"
            aria-label="Arama"
          >
            <Search size={20} />
          </button>
          <button
            type="button"
            className="p-2 text-zinc-300 hover:text-white"
            onClick={() => setOpenMobile(!openMobile)}
            aria-label="Menü"
          >
            {openMobile ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Drawer */}
      {openMobile && (
        <div className="border-t border-white/[0.08] bg-zinc-950 px-4 py-5 lg:hidden max-h-[85vh] overflow-y-auto">
          <div className="space-y-4">
            {/* Ürünler */}
            <div>
              <p className="font-mono text-xs uppercase tracking-wider text-emerald-400 font-semibold mb-2">
                Ürünler
              </p>
              <div className="space-y-1.5 pl-2">
                {PRODUCTS_MENU.map((item) => (
                  <Link
                    key={item.title}
                    href={item.href}
                    onClick={() => setOpenMobile(false)}
                    className="block py-1 text-sm font-medium text-zinc-300 hover:text-white"
                  >
                    {item.title}
                  </Link>
                ))}
              </div>
            </div>

            {/* Çözümler */}
            <div>
              <p className="font-mono text-xs uppercase tracking-wider text-blue-400 font-semibold mb-2">
                Çözümler
              </p>
              <div className="space-y-1.5 pl-2">
                {SOLUTIONS_MENU.map((item) => (
                  <Link
                    key={item.title}
                    href={item.href}
                    onClick={() => setOpenMobile(false)}
                    className="block py-1 text-sm font-medium text-zinc-300 hover:text-white"
                  >
                    {item.title}
                  </Link>
                ))}
              </div>
            </div>

            {/* Doğrudan Linkler */}
            <div className="pt-2 border-t border-white/[0.06] space-y-2">
              <Link
                href="/randevu"
                onClick={() => setOpenMobile(false)}
                className="flex items-center justify-between py-1.5 text-sm font-semibold text-cyan-300"
              >
                <span>In-House Randevu Takvimi</span>
                <span className="text-[10px] font-mono text-cyan-400">Google Meet</span>
              </Link>
              <Link
                href="/basari-hikayeleri"
                onClick={() => setOpenMobile(false)}
                className="block py-1.5 text-sm font-semibold text-white"
              >
                Başarı Hikayeleri
              </Link>
              <Link
                href="/kaynaklar"
                onClick={() => setOpenMobile(false)}
                className="block py-1.5 text-sm font-semibold text-white"
              >
                Kaynaklar & SSS
              </Link>
              <Link
                href="/manifesto"
                onClick={() => setOpenMobile(false)}
                className="flex items-center justify-between py-1.5 text-sm font-semibold text-white"
              >
                <span>Mühendislik Manifestosu</span>
                <span className="text-[10px] font-mono text-emerald-400">Culture</span>
              </Link>
            </div>

            {/* Mobile Actions */}
            <div className="pt-4 border-t border-white/[0.08] space-y-3">
              <button
                type="button"
                onClick={() => {
                  setOpenMobile(false);
                  openStrategyCallModal();
                }}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-green-400 py-3 text-sm font-bold text-zinc-950 shadow-md"
              >
                <Video className="h-4 w-4" />
                <span>Strateji Toplantısı Ayırtın</span>
              </button>

              <div className="flex gap-2">
                <Link
                  href="/auth/login"
                  onClick={() => setOpenMobile(false)}
                  className="flex-1 text-center py-2.5 rounded-lg border border-white/10 text-xs font-semibold text-zinc-300"
                >
                  Giriş Yap
                </Link>
                <Link
                  href="/teklif-al"
                  onClick={() => setOpenMobile(false)}
                  className="flex-1 text-center py-2.5 rounded-lg bg-zinc-800 text-xs font-semibold text-white"
                >
                  Proje Planla
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
