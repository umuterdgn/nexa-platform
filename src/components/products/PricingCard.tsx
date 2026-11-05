"use client";

import Link from "next/link";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export function PricingCard({ product }: { product: any }) {
  // Üründe geçerli bir indirim var mı kontrolü
  const hasDiscount =
    product.discountPrice > 0 && product.discountPrice < product.price;

  return (
    <div
      className={cn(
        "flex flex-col justify-between rounded-2xl border p-6 shadow-xl transition-all duration-300 bg-nexa-anthracite/40",
        product.highlighted
          ? "border-nexa-electric shadow-nexa-electric/5 scale-[1.02] lg:scale-105"
          : "border-white/5 hover:border-white/10",
      )}
    >
      <div>
        {/* Üst Başlık ve Öne Çıkan Rozeti */}
        <div className="flex items-center justify-between">
          <h3 className="font-display text-xl font-semibold text-white">
            {product.title}
          </h3>
          {product.highlighted && (
            <span className="rounded-full bg-nexa-electric/15 px-2.5 py-1 text-xs font-semibold text-nexa-electric-bright font-mono">
              En Popüler
            </span>
          )}
        </div>

        {/* 💰 Gelişmiş Fiyat Alanı (İndirim Duyarlı) */}
        <div className="mt-4 flex items-baseline text-white">
          {hasDiscount ? (
            <div className="flex flex-col">
              <span className="text-xs text-slate-500 line-through font-mono">
                ₺{product.price.toLocaleString("tr-TR")}
              </span>
              <div className="flex items-baseline">
                <span className="text-3xl font-bold tracking-tight text-emerald-400">
                  ₺{product.discountPrice.toLocaleString("tr-TR")}
                </span>
                <span className="ml-1 text-xs text-slate-400 font-medium">
                  /{product.type === "saas" ? "aylık" : "proje"}
                </span>
              </div>
            </div>
          ) : (
            <>
              <span className="text-3xl font-bold tracking-tight">
                ₺{product.price.toLocaleString("tr-TR")}
              </span>
              <span className="ml-1 text-xs text-slate-400 font-medium">
                /{product.type === "saas" ? "aylık" : "proje"}
              </span>
            </>
          )}
        </div>

        {/* Açıklama */}
        <p className="mt-4 text-sm text-slate-400 leading-relaxed min-h-[60px]">
          {product.description}
        </p>

        {/* Özellikler */}
        <ul className="mt-6 space-y-3 border-t border-white/5 pt-6 text-sm text-slate-300">
          {product.features.map((feature: string, idx: number) => (
            <li key={idx} className="flex items-center gap-2.5">
              <Check
                size={14}
                className="text-nexa-electric-bright flex-shrink-0"
              />
              <span className="truncate">{feature}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* 🚀 Ödeme Sayfasına Uçuran Dinamik Buton */}
      <div className="mt-8">
        <Link
          href={`/checkout/${product.id}`} // Veritabanındaki gerçek ID'ye yönlendiriyor
          className={cn(
            "block w-full rounded-xl py-3 text-center text-sm font-semibold text-white shadow-md transition-all active:scale-[0.98]",
            product.highlighted
              ? "bg-nexa-electric hover:bg-nexa-electric-bright shadow-neon-sm"
              : "bg-white/5 border border-white/10 hover:bg-white/10",
          )}
        >
          Hemen Başla
        </Link>
      </div>
    </div>
  );
}
