"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Building,
  CalendarCheck,
  GraduationCap,
  Sparkles,
  ArrowRight,
  BookOpen,
  FileCode2,
  Video,
  Layers,
  HelpCircle,
  TrendingUp,
  Cpu,
} from "lucide-react";
import { openStrategyCallModal } from "@/lib/modal-events";

interface PaletteItem {
  id: string;
  title: string;
  category: "Ürünler" | "Çözümler" | "Kaynaklar & SSS" | "Eylemler";
  description: string;
  href?: string;
  action?: () => void;
  icon: any;
  keywords?: string[];
}

const PALETTE_ITEMS: PaletteItem[] = [
  // Eylemler
  {
    id: "action-strategy",
    title: "Strateji Toplantısı Ayırtın (30 dk Google Meet)",
    category: "Eylemler",
    description: "Kurucu Umut Erdoğan ile birebir mimari ve fizibilite seansı",
    action: () => openStrategyCallModal(),
    icon: Video,
    keywords: ["toplantı", "görüşme", "calendly", "randevu", "umut erdoğan", "meet", "danışmanlık"],
  },
  {
    id: "action-quote",
    title: "Projenizi Planlayalım (48 Saat Mimari Rapor)",
    category: "Eylemler",
    description: "Özel projeniz için kapsamlı teknik bütçe ve analiz",
    href: "/teklif-al",
    icon: Sparkles,
    keywords: ["teklif", "plan", "48 saat", "fiyat", "bütçe", "başlat"],
  },
  // Ürünler
  {
    id: "product-erp",
    title: "Nexa ERP (B2B Business & Construction Management)",
    category: "Ürünler",
    description: "Şantiye, malzeme stok, hakediş ve SAP/Logo entegrasyonu",
    href: "/urunler",
    icon: Building,
    keywords: ["erp", "nexa erp", "erp nedir", "şantiye", "inşaat", "stok", "muhasebe", "hakediş"],
  },
  {
    id: "product-tamvaktinde",
    title: "Tam Vaktinde (Pazaryeri & Akıllı Randevu SaaS)",
    category: "Ürünler",
    description: "Çok şubeli online rezervasyon, WhatsApp botu ve PayTR ödeme",
    href: "/urunler",
    icon: CalendarCheck,
    keywords: ["randevu", "randevu al", "tam vaktinde", "pazaryeri", "slot", "whatsapp", "rezervasyon"],
  },
  {
    id: "product-nexaedu",
    title: "NexaEdu (Education Management System & LMS)",
    category: "Ürünler",
    description: "K12 okulları için akıllı yoklama, sınav analitiği ve veli portalı",
    href: "/urunler",
    icon: GraduationCap,
    keywords: ["nexaedu", "eğitim", "okul", "lms", "öğrenci", "veli", "yoklama", "k12"],
  },
  // Çözümler
  {
    id: "solution-custom",
    title: "Kuruma Özel (Custom) Web & Mobil Uygulama",
    category: "Çözümler",
    description: "Operasyon maliyetlerinizi %40 düşüren sıfırdan mimari",
    href: "/cozumler",
    icon: Cpu,
    keywords: ["özel yazılım", "custom", "mobil uygulama", "react native", "nextjs", "yazılım geliştirme"],
  },
  {
    id: "solution-roi",
    title: "ROI (Yatırım Getirisi) Hesaplayıcı",
    category: "Çözümler",
    description: "Personel sayınıza göre yıllık tasarruf saat ve bütçe simülasyonu",
    href: "/cozumler#roi-calculator",
    icon: TrendingUp,
    keywords: ["roi", "tasarruf", "hesaplayıcı", "maliyet", "personel", "slider", "yatırım getirisi"],
  },
  {
    id: "solution-insaat",
    title: "İnşaat & Şantiye Yönetimi Çözümü",
    category: "Çözümler",
    description: "Hakediş hesaplama, taşeron koordinasyonu ve malzeme takibi",
    href: "/cozumler#insaat",
    icon: Layers,
    keywords: ["inşaat", "şantiye", "taşeron", "hakediş", "malzeme"],
  },
  // Kaynaklar & SSS
  {
    id: "resource-manifesto",
    title: "Nexa Mühendislik Kültürü & Manifestosu",
    category: "Kaynaklar & SSS",
    description: "TEKNOFEST köklerinden küresel B2B SaaS mimarisine geçiş",
    href: "/manifesto",
    icon: BookOpen,
    keywords: ["manifesto", "kültür", "umut erdoğan", "felsefe", "iskenderun", "teknofest", "vizyon"],
  },
  {
    id: "resource-cases",
    title: "Başarı Hikayeleri & Vaka İncelemeleri",
    category: "Kaynaklar & SSS",
    description: "Şirketlerin operasyon maliyetlerini nasıl %40 düşürdük?",
    href: "/basari-hikayeleri",
    icon: FileCode2,
    keywords: ["başarı", "case study", "vaka", "referans", "sonuçlar", "hikaye"],
  },
  {
    id: "resource-faq",
    title: "B2B SaaS Sözlüğü & SSS Rehberi",
    category: "Kaynaklar & SSS",
    description: "ERP nedir, SAP entegrasyonu, SLA ve KVKK standartları",
    href: "/kaynaklar",
    icon: HelpCircle,
    keywords: ["sss", "faq", "sorular", "sözlük", "erp nedir", "sap", "entegrasyon", "kvkk"],
  },
];

export function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };

    const handleOpenCustom = () => {
      setIsOpen(true);
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("open-command-palette", handleOpenCustom);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("open-command-palette", handleOpenCustom);
    };
  }, []);

  useEffect(() => {
    if (isOpen) {
      setSearch("");
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  const filteredItems = PALETTE_ITEMS.filter((item) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    const titleMatch = item.title.toLowerCase().includes(q);
    const descMatch = item.description.toLowerCase().includes(q);
    const catMatch = item.category.toLowerCase().includes(q);
    const keywordMatch = item.keywords?.some((k) => k.toLowerCase().includes(q));
    return titleMatch || descMatch || catMatch || keywordMatch;
  });

  const handleSelect = (item: PaletteItem) => {
    setIsOpen(false);
    if (item.action) {
      item.action();
    } else if (item.href) {
      router.push(item.href);
    }
  };

  const handleListKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % Math.max(1, filteredItems.length));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) =>
        prev === 0 ? Math.max(0, filteredItems.length - 1) : prev - 1,
      );
    } else if (e.key === "Enter" && filteredItems[selectedIndex]) {
      e.preventDefault();
      handleSelect(filteredItems[selectedIndex]);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[110] flex items-start justify-center p-4 sm:p-6 pt-[12vh] sm:pt-[15vh]">
          {/* Dark Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/80 backdrop-blur-md"
          />

          {/* Dialog Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -10 }}
            transition={{ duration: 0.2 }}
            className="relative w-full max-w-2xl overflow-hidden rounded-2xl border border-white/15 bg-zinc-950 shadow-2xl z-10"
          >
            {/* Input Bar */}
            <div className="relative flex items-center border-b border-white/[0.08] px-4 py-3.5 bg-zinc-900/60">
              <Search className="h-5 w-5 text-emerald-400 shrink-0 mr-3" />
              <input
                ref={inputRef}
                type="text"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setSelectedIndex(0);
                }}
                onKeyDown={handleListKeyDown}
                placeholder="Sayfa, ürün veya konu arayın (örn. 'ERP Nedir?', 'Randevu Al', 'ROI')..."
                className="w-full bg-transparent text-sm sm:text-base text-white placeholder-zinc-400 focus:outline-none"
              />
              <kbd className="hidden sm:inline-flex items-center gap-1 rounded bg-zinc-800 px-2 py-0.5 font-mono text-[10px] text-zinc-400 border border-white/10">
                ESC
              </kbd>
            </div>

            {/* Results List */}
            <div className="max-h-[380px] overflow-y-auto p-2 divide-y divide-white/[0.04]">
              {filteredItems.length === 0 ? (
                <div className="py-12 text-center text-sm text-zinc-400">
                  <p>Eşleşen sonuç bulunamadı.</p>
                  <p className="mt-1 text-xs text-zinc-400">
                    Örn: "ERP", "Randevu", "Manifesto", "Toplantı", "ROI"
                  </p>
                </div>
              ) : (
                filteredItems.map((item, idx) => {
                  const Icon = item.icon;
                  const isSelected = idx === selectedIndex;

                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => handleSelect(item)}
                      onMouseEnter={() => setSelectedIndex(idx)}
                      className={`flex w-full items-center justify-between rounded-xl p-3 text-left transition-colors ${
                        isSelected
                          ? "bg-zinc-900/90 border border-emerald-500/30 text-white"
                          : "text-zinc-300 hover:bg-zinc-900/50"
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0 pr-3">
                        <div
                          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border transition-colors ${
                            isSelected
                              ? "bg-emerald-500/10 border-emerald-500/40 text-emerald-400"
                              : "bg-white/[0.04] border-white/10 text-zinc-400"
                          }`}
                        >
                          <Icon className="h-4 w-4" />
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-display text-sm font-semibold truncate text-white">
                              {item.title}
                            </span>
                            <span className="shrink-0 rounded bg-zinc-800/80 px-1.5 py-0.5 font-mono text-[10px] text-zinc-400 border border-white/5">
                              {item.category}
                            </span>
                          </div>
                          <p className="text-xs text-zinc-400 truncate mt-0.5">
                            {item.description}
                          </p>
                        </div>
                      </div>

                      <ArrowRight
                        className={`h-4 w-4 shrink-0 transition-transform ${
                          isSelected ? "text-emerald-400 translate-x-1" : "text-zinc-600"
                        }`}
                      />
                    </button>
                  );
                })
              )}
            </div>

            {/* Footer with Keyboard Hints */}
            <div className="border-t border-white/[0.08] bg-zinc-900/40 px-4 py-2.5 flex items-center justify-between text-[11px] text-zinc-400 font-mono">
              <div className="flex items-center gap-3">
                <span>
                  <kbd className="rounded bg-zinc-800 px-1.5 py-0.5 text-zinc-300 mr-1 border border-white/5">
                    ↑
                  </kbd>
                  <kbd className="rounded bg-zinc-800 px-1.5 py-0.5 text-zinc-300 mr-1 border border-white/5">
                    ↓
                  </kbd>
                  Gezin
                </span>
                <span>
                  <kbd className="rounded bg-zinc-800 px-1.5 py-0.5 text-zinc-300 mr-1 border border-white/5">
                    ↵
                  </kbd>
                  Seç
                </span>
              </div>
              <span>Nexa Command Center</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
