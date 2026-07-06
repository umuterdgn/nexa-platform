import Link from "next/link";
import { Calendar, Wallet } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ActiveProduct {
  name: string;
  daysRemaining: number;
  totalDays: number;
  panelUrl?: string;
  icon?: "calendar" | "wallet";
}

export function ActiveProductCard({
  name,
  daysRemaining,
  totalDays,
  panelUrl,
  icon = "calendar",
}: ActiveProduct) {
  const progress = Math.min(
    100,
    Math.round((daysRemaining / Math.max(totalDays, 1)) * 100)
  );

  const Icon = icon === "wallet" ? Wallet : Calendar;

  return (
    <article className="group flex flex-col rounded-2xl border border-white/10 bg-[#0F172A]/60 p-6 transition hover:border-[#1D4ED8]/40 hover:shadow-[0_0_24px_rgba(29,78,216,0.12)]">
      <div className="flex items-start justify-between gap-4">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#1D4ED8]/15 text-[#3B82F6]">
          <Icon size={22} strokeWidth={1.75} />
        </div>
        <span className="rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-400">
          Aktif
        </span>
      </div>

      <h3 className="mt-5 font-display text-lg font-semibold tracking-tight text-white">
        {name}
      </h3>

      <div className="mt-6">
        <div className="mb-2 flex items-baseline justify-between text-sm">
          <span className="text-slate-400">Kalan süre</span>
          <span className="font-medium text-white">
            {daysRemaining}{" "}
            <span className="font-normal text-slate-400">gün</span>
          </span>
        </div>
        <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
          <div
            className={cn(
              "h-full rounded-full bg-gradient-to-r from-[#1D4ED8] to-[#3B82F6] transition-all"
            )}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {panelUrl ? (
        <a
          href={panelUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 inline-flex items-center justify-center rounded-xl bg-[#1D4ED8] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#2563EB]"
        >
          Yönetim Paneline Git
        </a>
      ) : (
        <button
          disabled
          className="mt-6 inline-flex items-center justify-center rounded-xl bg-slate-700 px-4 py-2.5 text-sm font-semibold text-slate-400 cursor-not-allowed"
          title="Bu ürün için panel adresi tanımlanmamış"
        >
          Panel Tanımlanmamış
        </button>
      )}
    </article>
  );
}
