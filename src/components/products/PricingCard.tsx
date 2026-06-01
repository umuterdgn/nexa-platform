import Link from "next/link";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import type { MockProduct } from "@/lib/products-mock";

export function PricingCard({ product }: { product: MockProduct }) {
  return (
    <article
      className={cn(
        "relative flex flex-col rounded-2xl border p-8 transition duration-300",
        product.highlighted
          ? "border-[#1D4ED8]/50 bg-gradient-to-b from-[#1D4ED8]/10 to-[#0F172A]/80 shadow-[0_0_40px_rgba(29,78,216,0.15)]"
          : "border-white/10 bg-[#0F172A]/50 hover:border-[#1D4ED8]/30"
      )}
    >
      {product.highlighted && (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-[#1D4ED8] px-3 py-1 text-xs font-semibold text-white">
          En Popüler
        </span>
      )}

      <h3 className="font-display text-xl font-semibold text-white">
        {product.title}
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-slate-400">
        {product.description}
      </p>

      <div className="mt-6 flex items-baseline gap-1">
        <span className="font-display text-4xl font-bold text-white">
          ₺{product.price}
        </span>
        <span className="text-slate-500">/ {product.period}</span>
      </div>

      <ul className="mt-8 flex-1 space-y-3">
        {product.features.map((feature) => (
          <li key={feature} className="flex items-start gap-3 text-sm text-slate-300">
            <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#3B82F6]" strokeWidth={2.5} />
            {feature}
          </li>
        ))}
      </ul>

      <Link
        href={`/checkout/${product.id}`}
        className={cn(
          "mt-8 block rounded-xl py-3 text-center text-sm font-semibold transition",
          product.highlighted
            ? "bg-[#1D4ED8] text-white shadow-[0_0_24px_rgba(29,78,216,0.4)] hover:bg-[#2563EB]"
            : "border border-[#1D4ED8]/40 text-white hover:bg-[#1D4ED8]/10"
        )}
      >
        Hemen Başla
      </Link>
    </article>
  );
}
