"use client";

import React, { useState, useEffect } from "react";
import {
  ShieldCheck,
  CreditCard,
  Lock,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  ArrowRight,
  RefreshCw,
  Building2,
  Mail,
  Zap,
} from "lucide-react";
import Link from "next/link";

interface Props {
  orderNumber: string;
  productSlug: string;
  productTitle: string;
  planName: string;
  billingCycle: string;
  totalAmount: number;
  currency: string;
  customerName: string;
  customerEmail: string;
  companyName: string;
  initialStatus: string;
  paytrToken: string;
  ssoUrl?: string;
  isUserVerified?: boolean;
}

export function PaytrCheckoutView({
  orderNumber,
  productSlug,
  productTitle,
  planName,
  billingCycle,
  totalAmount,
  currency,
  customerName,
  customerEmail,
  companyName,
  initialStatus,
  paytrToken,
  ssoUrl = "https://nxa.com.tr/profil",
  isUserVerified = true,
}: Props) {
  const [status, setStatus] = useState<string>(initialStatus);
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulateSuccess, setSimulateSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // PayTR iFrame Resizer Scriptini Yükle
  useEffect(() => {
    if (paytrToken && !paytrToken.startsWith("paytr_token_mock_")) {
      const script = document.createElement("script");
      script.src = "https://www.paytr.com/js/iframeResizer.min.js";
      script.async = true;
      document.body.appendChild(script);

      script.onload = () => {
        if ((window as any).iFrameResize) {
          (window as any).iFrameResize({}, "#paytriframe");
        }
      };

      return () => {
        document.body.removeChild(script);
      };
    }
  }, [paytrToken]);

  // Test / Geliştirme Ortamı: PayTR Webhook'unu Anında Tetikleyip Başarılı Ödemeyi Simüle Et
  const handleSimulatePaytrSuccess = async () => {
    setIsSimulating(true);
    setErrorMessage(null);

    try {
      const res = await fetch("/api/webhooks/paytr", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          merchant_oid: orderNumber,
          status: "success",
          total_amount: Math.round(totalAmount * 100).toString(),
        }),
      });

      if (res.ok) {
        setStatus("SUCCESS");
        setSimulateSuccess(true);
      } else {
        throw new Error("Ödeme simülasyonu onaylanamadı.");
      }
    } catch (err: any) {
      setErrorMessage(err.message || "Simülasyon sırasında hata oluştu.");
    } finally {
      setIsSimulating(false);
    }
  };

  // ÖDEME BAŞARILI EKRANI (SUCCESS STATE)
  if (status === "SUCCESS" || simulateSuccess) {
    return (
      <div className="relative overflow-hidden rounded-3xl border border-emerald-500/40 bg-gradient-to-b from-slate-900/90 via-slate-900/50 to-slate-950 p-8 sm:p-12 text-center shadow-2xl backdrop-blur-xl">
        <div className="pointer-events-none absolute -top-20 left-1/2 -translate-x-1/2 h-52 w-96 rounded-full bg-emerald-500/15 blur-[90px]" />

        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl border border-emerald-500/40 bg-emerald-500/10 text-emerald-400 mb-5 shadow-lg shadow-emerald-500/10">
          <CheckCircle2 className="h-10 w-10" />
        </div>

        <span className="inline-block rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-1 text-xs font-mono font-bold text-emerald-400">
          PayTR 3D Secure Onaylandı &bull; Lisans Aktif
        </span>

        <h2 className="mt-3 text-2xl sm:text-4xl font-extrabold text-white">
          Ödemeniz Başarıyla Alındı!
        </h2>

        <p className="mx-auto mt-3 max-w-lg text-sm text-slate-300">
          Sayın <strong className="text-white">{customerName}</strong> (<strong>{companyName}</strong>), {productTitle} ({planName}) lisans aktivasyonunuz tamamlandı.
        </p>

        {/* Sipariş & SSO Bilgileri Kartı */}
        <div className="mx-auto mt-6 max-w-lg rounded-2xl border border-slate-800 bg-slate-950/80 p-5 text-left text-xs space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-2.5">
            <span className="text-slate-400 font-mono">Sipariş Numarası:</span>
            <span className="font-mono font-bold text-cyan-400">{orderNumber}</span>
          </div>
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-2.5">
            <span className="text-slate-400 font-mono">Toplam Tutar (KDV Dahil):</span>
            <span className="font-bold text-emerald-400">
              {totalAmount.toLocaleString("tr-TR")} {currency}
            </span>
          </div>
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-2.5">
            <span className="text-slate-400 font-mono">E-Posta Faturası:</span>
            <span className="text-slate-200">{customerEmail}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-400 font-mono">SaaS Tenant Durumu:</span>
            <span className="text-emerald-400 font-bold flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Aktif & Canlıda
            </span>
          </div>
        </div>

        {/* SSO Panel Butonları */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto">
          <a
            href={ssoUrl}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-cyan-500 px-6 py-3.5 text-xs sm:text-sm font-bold text-white shadow-lg shadow-cyan-500/25 transition-all hover:scale-[1.02] cursor-pointer"
          >
            <span>Yönetim Paneline Git (SSO)</span>
            <ExternalLink className="h-4 w-4" />
          </a>

          <Link
            href="/profil"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-800 px-5 py-3.5 text-xs font-semibold text-slate-200 hover:bg-slate-700 transition"
          >
            <span>Müşteri Konsolum</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* SOL KOLON: SİPARİŞ ÖZETİ VE GÜVENLİK */}
      <div className="lg:col-span-5 space-y-5">
        <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 sm:p-7 backdrop-blur-xl">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-4 mb-4">
            <span className="text-xs font-mono font-semibold uppercase tracking-wider text-cyan-400">
              Sipariş Özeti
            </span>
            <span className="text-xs font-mono text-slate-400">{orderNumber}</span>
          </div>

          <h3 className="text-xl font-extrabold text-white">{productTitle}</h3>
          <p className="mt-1 text-xs text-slate-300">
            {planName} &bull; {billingCycle === "YEARLY" ? "Yıllık Lisans (%20 Tasarruf)" : "Aylık Lisans"}
          </p>

          <div className="mt-5 space-y-2.5 rounded-2xl border border-slate-800/80 bg-slate-950/80 p-4 text-xs font-mono">
            <div className="flex justify-between text-slate-400">
              <span>Kurum:</span>
              <span className="text-white font-sans">{companyName}</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Yetkili:</span>
              <span className="text-white font-sans">{customerName}</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>E-Posta:</span>
              <span className="text-cyan-300">{customerEmail}</span>
            </div>
            <div className="border-t border-slate-800/80 pt-2.5 flex justify-between text-slate-300">
              <span>Ara Toplam:</span>
              <span>{(totalAmount / 1.2).toLocaleString("tr-TR", { maximumFractionDigits: 2 })} {currency}</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>%20 KDV:</span>
              <span>{(totalAmount - totalAmount / 1.2).toLocaleString("tr-TR", { maximumFractionDigits: 2 })} {currency}</span>
            </div>
            <div className="border-t border-slate-800/80 pt-2.5 flex justify-between text-sm font-bold text-white">
              <span>Ödenecek Tutar:</span>
              <span className="text-emerald-400 font-mono text-base">
                {totalAmount.toLocaleString("tr-TR")} {currency}
              </span>
            </div>
          </div>

          {/* Güvenlik Rozetleri */}
          <div className="mt-6 space-y-3 pt-5 border-t border-slate-800/80 text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-emerald-400 shrink-0" />
              <span>256-bit SSL & BDDK Lisanslı PayTR 3D Secure Koruması</span>
            </div>
            <div className="flex items-center gap-2">
              <Lock className="h-4 w-4 text-cyan-400 shrink-0" />
              <span>Kart bilgileriniz Nexa sunucularında asla saklanmaz</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-blue-400 shrink-0" />
              <span>Ödeme anında otomatik tenant aktivasyonu ve e-Arşiv fatura</span>
            </div>
          </div>
        </div>
      </div>

      {/* SAĞ KOLON: PAYTR IFRAME VEYA 3D SECURE GİRİŞ ALANI */}
      <div className="lg:col-span-7">
        <div className="relative rounded-3xl border border-slate-800/90 bg-slate-900/60 p-6 sm:p-8 backdrop-blur-xl shadow-2xl">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-4 mb-6">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10 border border-blue-500/30 text-blue-400">
                <CreditCard className="h-4 w-4" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">PayTR 3D Secure Ödeme Ekranı</h4>
                <p className="text-[11px] text-slate-400 font-mono">Tüm Kredi / Banka Kartları & Taksit</p>
              </div>
            </div>
            <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-mono font-semibold text-emerald-400">
              Canlı Ağ
            </span>
          </div>

          {/* Eğer PayTR Token gerçek bir token ise doğrudan resmi iframe'i render et */}
          {paytrToken && !paytrToken.startsWith("paytr_token_mock_") ? (
            <div className="overflow-hidden rounded-2xl bg-white p-2 shadow-inner">
              <iframe
                src={`https://www.paytr.com/odeme/guvenli/${paytrToken}`}
                id="paytriframe"
                frameBorder="0"
                scrolling="no"
                style={{ width: "100%", minHeight: "580px" }}
              />
            </div>
          ) : (
            /* PayTR Test / Simülasyon Kartı (Gerçek kart ücreti kesilmeden 3D Secure akışını test etme) */
            <div className="space-y-6">
              <div className="rounded-2xl border border-cyan-500/30 bg-cyan-950/20 p-4 text-xs text-cyan-300">
                <div className="flex items-center gap-2 font-bold mb-1">
                  <ShieldCheck className="h-4 w-4" />
                  <span>PayTR Test / Geliştirici Modu</span>
                </div>
                <p className="text-[11px] text-slate-300">
                  Gerçek PayTR kimlik bilgileri (.env) henüz tanımlanmadığında veya test aşamasında, aşağıdaki buton PayTR Webhook motorunu simüle ederek siparişinizi anında onaylar ve SSO lisansınızı üretir.
                </p>
              </div>

              {/* Temsili Kart Arayüzü */}
              <div className="rounded-2xl border border-slate-800 bg-slate-950/90 p-5 space-y-4">
                <div>
                  <label className="block text-[11px] font-mono text-slate-400 mb-1">
                    Kart Üzerindeki İsim
                  </label>
                  <input
                    type="text"
                    readOnly
                    value={customerName || "NEXA TEST USER"}
                    className="w-full rounded-xl border border-slate-800 bg-slate-900 px-3.5 py-2.5 text-xs text-slate-200 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-slate-400 mb-1">
                    Kart Numarası (PayTR Test Kartı)
                  </label>
                  <input
                    type="text"
                    readOnly
                    value="4282 2000 0000 0001 (Test Kartı)"
                    className="w-full rounded-xl border border-slate-800 bg-slate-900 px-3.5 py-2.5 text-xs text-cyan-300 font-mono"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-mono text-slate-400 mb-1">
                      Son Kullanma Tarihi
                    </label>
                    <input
                      type="text"
                      readOnly
                      value="12 / 28"
                      className="w-full rounded-xl border border-slate-800 bg-slate-900 px-3.5 py-2.5 text-xs text-slate-200 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-mono text-slate-400 mb-1">
                      CVV / Güvenlik Kodu
                    </label>
                    <input
                      type="text"
                      readOnly
                      value="000"
                      className="w-full rounded-xl border border-slate-800 bg-slate-900 px-3.5 py-2.5 text-xs text-slate-200 font-mono"
                    />
                  </div>
                </div>
              </div>

              {errorMessage && (
                <div className="flex items-center gap-2 rounded-xl border border-red-500/30 bg-red-950/30 p-3 text-xs text-red-400">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* PayTR Simüle Et Butonu */}
              <button
                type="button"
                onClick={handleSimulatePaytrSuccess}
                disabled={isSimulating}
                className="w-full flex items-center justify-center gap-2.5 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-cyan-500 py-4 text-xs sm:text-sm font-extrabold text-white shadow-xl shadow-cyan-500/25 transition-all hover:scale-[1.01] active:scale-95 disabled:opacity-50 cursor-pointer"
              >
                {isSimulating ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    <span>PayTR Webhook Onaylanıyor ve Tenant Kuruluyor...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="h-4 w-4" />
                    <span>PayTR ile Güvenli Öde ({totalAmount.toLocaleString("tr-TR")} {currency})</span>
                  </>
                )}
              </button>

              <p className="text-center text-[11px] text-slate-500">
                Butona tıklandığında PayTR Webhook servisi tetiklenir, sipariş durumu Prisma&apos;da SUCCESS olarak güncellenir ve kurumsal aktivasyon e-postanız gönderilir.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

