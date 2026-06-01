"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Check, Loader2, CreditCard } from "lucide-react";
import { TestPaymentForm } from "@/components/checkout/TestPaymentForm";
import type { ProductCardData } from "@/types/product-card";

export function CheckoutClient({ product }: { product: ProductCardData }) {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");

  const kdv = Math.round(product.price * 0.2);
  const total = product.price + kdv;

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace(`/auth/login?callbackUrl=/checkout/${product.slug}`);
    }
  }, [status, router, product.slug]);

  async function handleTestPayment() {
    setProcessing(true);
    setError("");

    const delay = new Promise((r) => setTimeout(r, 2000));
    const payment = fetch("/api/simulate-payment", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId: product.slug }),
    });

    const [, res] = await Promise.all([delay, payment]);
    const data = await res.json();

    if (!res.ok) {
      setError(data.error ?? "Ödeme başarısız.");
      setProcessing(false);
      return;
    }

    router.push("/profil?odeme=basarili");
    router.refresh();
  }

  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black">
        <Loader2 className="h-8 w-8 animate-spin text-[#1D4ED8]" />
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
          <p className="text-xs font-medium uppercase tracking-widest text-[#3B82F6]">
            Sipariş Özeti
          </p>
          <h1 className="mt-2 font-display text-2xl font-semibold text-white">
            {product.title}
          </h1>
          <p className="mt-1 text-sm text-slate-400">{session?.user?.email}</p>

          <div className="mt-8 flex items-baseline gap-2 border-t border-white/10 pt-8">
            <span className="font-display text-4xl font-bold text-white">₺{total}</span>
            <span className="text-slate-500">/ aylık</span>
          </div>
          <p className="mt-2 text-sm text-slate-500">
            KDV dahil (₺{product.price} + ₺{kdv} KDV)
          </p>

          <ul className="mt-6 space-y-2">
            {product.features.slice(0, 4).map((f) => (
              <li key={f} className="flex items-center gap-2 text-sm text-slate-300">
                <Check className="h-3.5 w-3.5 shrink-0 text-[#3B82F6]" />
                {f}
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-2xl border border-[#1D4ED8]/20 bg-[#0F172A]/80 p-8">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#1D4ED8]/20">
              <CreditCard className="h-5 w-5 text-[#3B82F6]" />
            </div>
            <div>
              <h2 className="font-display text-xl font-semibold text-white">
                Test Ödeme Formu
              </h2>
              <p className="text-xs text-slate-400">Simülasyon modu</p>
            </div>
          </div>

          <TestPaymentForm onSubmit={handleTestPayment} processing={processing} />
          {error && (
            <p className="mt-4 rounded-lg bg-red-500/10 px-3 py-2 text-center text-sm text-red-400">
              {error}
            </p>
          )}
        </section>
      </main>
    </div>
  );
}
