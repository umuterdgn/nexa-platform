"use client";

import React, { useState } from "react";
import {
  X,
  Sparkles,
  Zap,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Loader2,
  Lock,
  Layers,
  Store,
  Boxes,
} from "lucide-react";
import type { CustomerSubscription } from "@/types/saas";

interface QuickStoreModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubscriptionAdded: (newSub: CustomerSubscription) => void;
}

interface StoreItem {
  slug: string;
  title: string;
  tagline: string;
  badge: string;
  icon: string;
  monthlyPrice: number;
  yearlyPrice: number; // Yıllık seçimde aylık karşılığı
  isOneTime?: boolean;
}

const STORE_CATALOG: StoreItem[] = [
  {
    slug: "ai_token_5",
    title: "Ek 5 AI Görsel Jetonu",
    tagline: "Yapay zeka 3D render ve derin görsel işleme kredisi",
    badge: "Anında Hesap Yükleme",
    icon: "Sparkles",
    monthlyPrice: 490,
    yearlyPrice: 490,
    isOneTime: true,
  },
  {
    slug: "tam-vaktinde",
    title: "Tam Vaktinde SaaS",
    tagline: "Saha ekipleri, randevu ve mobil teknisyen takip OS",
    badge: "Mobil Saha OS",
    icon: "Zap",
    monthlyPrice: 1890,
    yearlyPrice: 1490,
  },
  {
    slug: "nexa-erp",
    title: "Nexa ERP (İnşaat & CDE)",
    tagline: "%100 Çevrimdışı PWA, Dexie.js ve 3D BIM hakediş blokesi",
    badge: "3D BIM & CDE",
    icon: "Boxes",
    monthlyPrice: 2990,
    yearlyPrice: 2390,
  },
  {
    slug: "nexa-pos",
    title: "Nexa POS & QR Kasa",
    tagline: "STM & Artı POS donanım uyumlu restoran ve toptancı kasası",
    badge: "Hibrit Bulut POS",
    icon: "Store",
    monthlyPrice: 1490,
    yearlyPrice: 1190,
  },
];

export function QuickStoreModal({
  isOpen,
  onClose,
  onSubscriptionAdded,
}: QuickStoreModalProps) {
  const [selectedSlug, setSelectedSlug] = useState<string>("ai_token_5");
  const [billingCycle, setBillingCycle] = useState<"MONTHLY" | "YEARLY">("YEARLY");
  const [loading, setLoading] = useState<boolean>(false);
  const [successResult, setSuccessResult] = useState<{
    message: string;
    subscription: CustomerSubscription;
    ssoUrl: string;
  } | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const currentItem = STORE_CATALOG.find((item) => item.slug === selectedSlug) || STORE_CATALOG[0];
  const isYearly = !currentItem.isOneTime && billingCycle === "YEARLY";
  const basePrice = currentItem.isOneTime
    ? currentItem.yearlyPrice
    : isYearly
    ? currentItem.yearlyPrice * 12
    : currentItem.monthlyPrice;
  const taxAmount = Math.round(basePrice * 0.2 * 100) / 100;
  const grandTotal = Math.round((basePrice + taxAmount) * 100) / 100;

  const handlePurchase = async () => {
    setLoading(true);
    setErrorMsg(null);

    try {
      const res = await fetch("/api/dashboard/quick-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productSlug: currentItem.slug,
          billingCycle: currentItem.isOneTime ? "ONE_TIME" : billingCycle,
          planTier: "PRO",
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setSuccessResult({
          message: data.message,
          subscription: data.subscription,
          ssoUrl: data.ssoUrl,
        });
        onSubscriptionAdded(data.subscription);
      } else {
        setErrorMsg(data.message || "Satın alma başlatılamadı.");
      }
    } catch (err: any) {
      setErrorMsg("Sunucuya bağlanırken bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSuccessResult(null);
    setErrorMsg(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-2xl overflow-hidden rounded-3xl border border-cyan-500/30 bg-slate-900 p-6 sm:p-8 shadow-2xl shadow-cyan-500/10 text-slate-100">
        {/* Kapatma Butonu */}
        <button
          onClick={handleReset}
          className="absolute top-5 right-5 p-2 rounded-xl bg-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-700 transition"
          aria-label="Kapat"
        >
          <X className="w-5 h-5" />
        </button>

        {successResult ? (
          /* BAŞARILI AKTİVASYON VE SSO EKRANI */
          <div className="text-center py-6">
            <div className="mx-auto w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mb-5">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400">
              Ödeme Onaylandı & Lisans Aktif
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white mt-2">
              {successResult.subscription.productTitle} Hesabınıza Tanımlandı!
            </h2>
            <p className="mt-3 text-sm text-slate-300 max-w-md mx-auto leading-relaxed">
              Veritabanında şirket lisansınız açıldı ve Single Sign-On (SSO) yetkiniz mühürlendi.
            </p>

            {/* Fatura & Sipariş Bilgisi Kartı */}
            <div className="mt-6 p-4 rounded-2xl bg-slate-950/70 border border-slate-800 text-left max-w-md mx-auto space-y-2 text-xs font-mono">
              <div className="flex justify-between text-slate-400">
                <span>Sipariş No:</span>
                <span className="text-white font-bold">{successResult.subscription.orderNumber}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>e-Fatura No:</span>
                <span className="text-cyan-400 font-bold">{successResult.subscription.invoiceNumber}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Tahsil Edilen:</span>
                <span className="text-emerald-400 font-bold">
                  {successResult.subscription.invoiceAmount.toLocaleString("tr-TR")} ₺
                </span>
              </div>
            </div>

            {/* Aksiyon Butonları */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <a
                href={successResult.ssoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-sm shadow-lg shadow-cyan-500/25 transition flex items-center gap-2"
              >
                <span>Yönetim Paneline Git (SSO)</span>
                <ArrowRight className="w-4 h-4" />
              </a>
              <button
                onClick={handleReset}
                className="px-6 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-sm transition"
              >
                Müşteri Paneline Dön
              </button>
            </div>
          </div>
        ) : (
          /* SATIN ALMA EKRANI */
          <div>
            <div className="flex items-center gap-3 border-b border-slate-800 pb-5">
              <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[11px] font-mono uppercase tracking-wider text-cyan-400 font-bold">
                  Nexa Müşteri Mağazası &bull; Panelden Ayrılmadan Ekle
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-white">
                  Yeni Hizmet veya Jeton Paketi Satın Al
                </h2>
              </div>
            </div>

            {errorMsg && (
              <div className="mt-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs">
                {errorMsg}
              </div>
            )}

            {/* Ürün Seçim Listesi */}
            <div className="mt-6 space-y-3">
              <span className="text-xs font-mono font-bold uppercase text-slate-400 block">
                1. Tanımlanacak Ürün veya Hizmeti Seçin:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {STORE_CATALOG.map((item) => {
                  const isSelected = item.slug === selectedSlug;
                  return (
                    <div
                      key={item.slug}
                      onClick={() => setSelectedSlug(item.slug)}
                      className={`cursor-pointer p-4 rounded-2xl border transition-all duration-200 ${
                        isSelected
                          ? "border-cyan-500 bg-cyan-950/20 shadow-md shadow-cyan-500/10"
                          : "border-slate-800 bg-slate-950/50 hover:border-slate-700 hover:bg-slate-800/40"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-white">{item.title}</span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                          {item.badge}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 leading-tight">
                        {item.tagline}
                      </p>
                      <div className="mt-3 text-xs font-mono font-bold text-cyan-300">
                        {item.yearlyPrice.toLocaleString("tr-TR")} ₺
                        <span className="text-[10px] font-normal text-slate-400">
                          {item.isOneTime ? " (Tek Seferlik)" : " / Ay (Yıllık)"}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Döngü Seçimi (Tek seferlik jetonlar hariç) */}
            {!currentItem.isOneTime && (
              <div className="mt-6 flex items-center justify-between p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800">
                <span className="text-xs font-mono text-slate-300">Ödeme Döngüsü:</span>
                <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-900 border border-slate-800">
                  <button
                    type="button"
                    onClick={() => setBillingCycle("MONTHLY")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                      billingCycle === "MONTHLY"
                        ? "bg-slate-800 text-white"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    Aylık
                  </button>
                  <button
                    type="button"
                    onClick={() => setBillingCycle("YEARLY")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 ${
                      billingCycle === "YEARLY"
                        ? "bg-cyan-500 text-slate-950"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    <span>Yıllık</span>
                    <span className="text-[9px] px-1 py-0.2 rounded bg-slate-950 text-cyan-300">
                      %20 Tasarruf
                    </span>
                  </button>
                </div>
              </div>
            )}

            {/* Tutar Özeti */}
            <div className="mt-6 p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2 font-mono text-xs">
              <div className="flex justify-between text-slate-400">
                <span>Ara Toplam:</span>
                <span>{basePrice.toLocaleString("tr-TR")} ₺</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>KDV (%20):</span>
                <span>{taxAmount.toLocaleString("tr-TR")} ₺</span>
              </div>
              <div className="flex justify-between text-sm font-bold text-white pt-2 border-t border-slate-800">
                <span className="text-cyan-400">Ödenecek Tutar:</span>
                <span className="text-cyan-300">{grandTotal.toLocaleString("tr-TR")} ₺</span>
              </div>
            </div>

            {/* Ödeme Başlatma Butonu */}
            <div className="mt-6 flex items-center justify-between gap-4 pt-4 border-t border-slate-800">
              <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
                <Lock className="w-4 h-4 text-emerald-400" />
                <span>PayTR & İyzico 256-bit Güvenli Ödeme</span>
              </div>

              <button
                onClick={handlePurchase}
                disabled={loading}
                className="px-7 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs shadow-lg shadow-cyan-500/25 transition flex items-center gap-2 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Lisans Tanımlanıyor...</span>
                  </>
                ) : (
                  <>
                    <span>Öde & Hesaba Ekle</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

