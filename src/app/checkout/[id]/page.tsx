"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Shield, Check, Loader2 } from "lucide-react";
import { getProductById } from "@/lib/products-mock";
import { PaytrIframe } from "@/components/checkout/PaytrIframe";

export default function CheckoutPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { data: session, status } = useSession();

  const product = getProductById(id);
  const [paytrToken, setPaytrToken] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const kdv = product ? Math.round(product.price * 0.2) : 0;
  const total = product ? product.price + kdv : 0;

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace(`/auth/login?callbackUrl=/checkout/${id}`);
    }
  }, [status, router, id]);

  useEffect(() => {
    if (status !== "authenticated" || !product) return;

    async function fetchToken() {
      setLoading(true);
      setError("");

      const res = await fetch("/api/paytr/token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: id }),
      });

      const data = await res.json();
      setLoading(false);

      if (!res.ok) {
        setError(data.error ?? "Ödeme başlatılamadı.");
        return;
      }

      setPaytrToken(data.token);
    }

    fetchToken();
  }, [status, product, id]);

  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black">
        <Loader2 className="h-8 w-8 animate-spin text-[#1D4ED8]" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-black text-center">
        <p className="text-white">Ürün bulunamadı.</p>
        <Link href="/urunler" className="mt-4 text-[#3B82F6] hover:underline">
          Ürünlere dön
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <header className="border-b border-white/10">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Link href="/urunler" className="text-sm text-slate-400 hover:text-white">
            ← Ürünlere dön
          </Link>
          <Link href="/" className="font-display text-lg font-semibold">
            <span className="text-gradient-nexa">Nexa</span>
          </Link>
        </div>
      </header>

      <main className="mx-auto grid max-w-6xl gap-8 px-4 py-10 lg:grid-cols-2 lg:gap-12 lg:py-16 sm:px-6">
        <section className="rounded-2xl border border-white/10 bg-[#0F172A]/60 p-8">
          <h1 className="font-display text-2xl font-semibold text-white">
            Sipariş Özeti
          </h1>
          <p className="mt-1 text-sm text-slate-400">{session?.user?.email}</p>

          <div className="mt-8 rounded-xl border border-white/5 bg-black/40 p-6">
            <h2 className="font-semibold text-white">{product.title}</h2>
            <p className="mt-2 text-sm text-slate-400">{product.description}</p>
            <ul className="mt-4 space-y-2">
              {product.features.slice(0, 3).map((f) => (
                <li key={f} className="flex items-center gap-2 text-sm text-slate-300">
                  <Check className="h-3.5 w-3.5 text-[#3B82F6]" />
                  {f}
                </li>
              ))}
            </ul>
          </div>

          <dl className="mt-8 space-y-3 border-t border-white/10 pt-6 text-sm">
            <div className="flex justify-between text-slate-400">
              <dt>Ara toplam</dt>
              <dd className="text-white">₺{product.price}</dd>
            </div>
            <div className="flex justify-between text-slate-400">
              <dt>KDV (%20)</dt>
              <dd className="text-white">₺{kdv}</dd>
            </div>
            <div className="flex justify-between border-t border-white/10 pt-3 text-base font-semibold">
              <dt className="text-white">Toplam</dt>
              <dd className="text-[#3B82F6]">
                ₺{total} / {product.period}
              </dd>
            </div>
          </dl>
        </section>

        <section className="flex flex-col rounded-2xl border border-[#1D4ED8]/20 bg-[#0F172A]/80 p-8 shadow-[0_0_40px_rgba(29,78,216,0.08)]">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#1D4ED8]/20">
              <Shield className="h-5 w-5 text-[#3B82F6]" />
            </div>
            <div>
              <h2 className="font-display text-xl font-semibold text-white">
                Güvenli Ödeme Alanı
              </h2>
              <p className="text-xs text-slate-400">256-bit SSL · PayTR</p>
            </div>
          </div>

          <div className="min-h-[420px] rounded-xl border border-white/10 bg-black/50 p-2">
            {loading && (
              <div className="flex h-[420px] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-[#1D4ED8]" />
              </div>
            )}
            {error && (
              <div className="flex h-[420px] flex-col items-center justify-center px-4 text-center">
                <p className="text-sm text-red-400">{error}</p>
                <p className="mt-2 text-xs text-slate-500">
                  .env dosyasında PayTR bilgilerini kontrol edin.
                </p>
              </div>
            )}
            {paytrToken && !loading && <PaytrIframe token={paytrToken} />}
          </div>

          <p className="mt-6 text-center text-xs text-slate-500">
            Ödeme bilgileriniz Nexa tarafından saklanmaz.
          </p>
        </section>
      </main>
    </div>
  );
}
