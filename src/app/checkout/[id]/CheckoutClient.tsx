"use client";

import { useState, useEffect } from "react";
import { ShieldCheck, Loader2 } from "lucide-react";

export function CheckoutClient({ product }: { product: any }) {
  const [loading, setLoading] = useState(false);
  const [paytrToken, setPaytrToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const activePrice =
    product.discountPrice > 0 ? product.discountPrice : product.price;

  const handlePaymentStart = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/payment/paytr", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: product.id }),
      });

      const data = await res.json();

      if (res.ok && data.token) {
        setPaytrToken(data.token);
      } else {
        setError(data.error || "Ödeme başlatılamadı. Lütfen tekrar deneyin.");
      }
    } catch (err) {
      setError("Bağlantı hatası oluştu.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (paytrToken) {
      const script = document.createElement("script");
      script.src = "https://www.paytr.com/js/iframeResizer.min.js";
      script.async = true;
      document.body.appendChild(script);

      script.onload = () => {
        if (window.iFrameResize) {
          window.iFrameResize({}, "#paytriframe");
        }
      };

      return () => {
        document.body.removeChild(script);
      };
    }
  }, [paytrToken]);

  return (
    <div className="w-full max-w-4xl">
      {paytrToken ? (
        /* 💳 PAYTR EKRANI AÇILDIĞINDA GÖRÜNECEK KISIM */
        <div className="rounded-2xl bg-white p-2 w-full overflow-hidden shadow-[0_0_30px_rgba(59,130,246,0.2)] transition-all duration-500">
          <iframe
            src={`https://www.paytr.com/odeme/guvenli/${paytrToken}`}
            id="paytriframe"
            frameBorder="0"
            scrolling="no"
            style={{ width: "100%", minHeight: "600px" }}
          />
        </div>
      ) : (
        /* 🛒 SİPARİŞ ÖZETİ VE ÖDEME BUTONU EKRANI (Senin Tasarımın) */
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {/* SOL: Özet Kartı */}
          <div className="h-fit rounded-2xl border border-white/10 bg-nexa-anthracite/40 p-8">
            <h2 className="mb-6 tracking-widest text-sm font-semibold uppercase text-nexa-electric-bright">
              Sipariş Özeti
            </h2>
            <div className="mb-4">
              <h3 className="font-display text-2xl font-bold">
                {product.title}
              </h3>
              <p className="mt-2 text-sm text-slate-400">
                {product.description}
              </p>
            </div>

            <div className="mt-6 flex items-end justify-between border-t border-white/10 pt-4">
              <span className="text-slate-400">Toplam Tutar:</span>
              <span className="text-3xl font-bold text-emerald-400">
                ₺{activePrice.toLocaleString("tr-TR")}
              </span>
            </div>
          </div>

          {/* SAĞ: PayTR Bağlantı Kartı */}
          <div className="rounded-2xl border border-nexa-electric/30 bg-nexa-anthracite/80 p-8 shadow-[0_0_30px_rgba(59,130,246,0.1)] flex flex-col justify-center">
            <h2 className="mb-6 flex items-center gap-2 text-xl font-bold">
              💳 Güvenli Ödeme
            </h2>

            <div className="mb-8 rounded-xl bg-blue-500/10 border border-blue-500/20 p-4 flex gap-4">
              <ShieldCheck className="text-blue-400 shrink-0" size={24} />
              <div className="text-sm text-blue-100/70">
                Ödemeniz{" "}
                <span className="font-semibold text-white">
                  PayTR 256-bit SSL
                </span>{" "}
                ile şifrelenerek bankanıza iletilir. Kart bilgileriniz
                kesinlikle kaydedilmez.
              </div>
            </div>

            {error && (
              <div className="mb-6 rounded-lg bg-red-500/10 border border-red-500/20 p-3 text-sm text-red-400 text-center">
                {error}
              </div>
            )}

            <button
              onClick={handlePaymentStart}
              disabled={loading}
              className="mt-2 w-full flex items-center justify-center gap-2 rounded-xl bg-nexa-electric py-4 font-bold text-white shadow-neon-sm transition-all hover:bg-nexa-electric-bright active:scale-95 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  Güvenli Bağlantı Kuruluyor...
                </>
              ) : (
                "Güvenle Öde (PayTR)"
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
