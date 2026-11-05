"use client";

import React from "react";
import Link from "next/link";
import {
  Calendar,
  Wallet,
  ExternalLink,
  ShieldCheck,
  FileText,
  Clock,
  Sparkles,
  Zap,
  Building2,
  Store,
  Layers,
} from "lucide-react";
import type { CustomerSubscription } from "@/types/saas";

export interface ActiveProductCardProps {
  subscription: CustomerSubscription;
  onViewInvoice: (sub: CustomerSubscription) => void;
}

export function ActiveProductCard({
  subscription,
  onViewInvoice,
}: ActiveProductCardProps) {
  const {
    productTitle,
    productTagline,
    badge = "Aktif Lisans",
    planName,
    daysRemaining,
    totalDays,
    progressPercentage,
    ssoUrl,
    invoiceNumber,
    invoiceStatus,
    invoiceAmount,
    productSlug,
  } = subscription;

  const isLowRemaining = daysRemaining <= 30;

  // Ürüne özel ikon seçimi
  const getProductIcon = () => {
    if (productSlug.includes("erp")) return <Building2 className="w-5 h-5 text-emerald-400" />;
    if (productSlug.includes("pos")) return <Store className="w-5 h-5 text-cyan-400" />;
    if (productSlug.includes("vaktinde")) return <Zap className="w-5 h-5 text-blue-400" />;
    if (productSlug.includes("token")) return <Sparkles className="w-5 h-5 text-amber-400" />;
    return <Layers className="w-5 h-5 text-cyan-400" />;
  };

  return (
    <article className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-slate-800/80 bg-slate-900/50 p-6 sm:p-7 backdrop-blur-xl transition-all duration-300 hover:border-cyan-500/40 hover:shadow-[0_0_35px_rgba(6,182,212,0.12)]">
      {/* Üst Glow Efekti */}
      <div className="pointer-events-none absolute -inset-px rounded-3xl bg-gradient-to-br from-cyan-500/5 via-transparent to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />

      <div className="relative z-10">
        {/* Üst Rozetler ve İkon */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-800 bg-slate-950/80 shadow-inner">
              {getProductIcon()}
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-400 font-bold block">
                {badge}
              </span>
              <h3 className="font-display text-lg sm:text-xl font-bold tracking-tight text-white leading-tight">
                {productTitle}
              </h3>
            </div>
          </div>

          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-[11px] font-mono font-bold text-emerald-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Aktif
          </span>
        </div>

        {/* Plan ve Açıklama */}
        <div className="mt-4">
          <p className="text-xs font-mono font-semibold text-slate-300">
            Paket: <span className="text-white font-bold">{planName}</span>
          </p>
          {productTagline && (
            <p className="text-xs text-slate-400 mt-1 line-clamp-1">
              {productTagline}
            </p>
          )}
        </div>

        {/* Lisans Kalan Süre Progress Bar */}
        <div className="mt-6 p-4 rounded-2xl bg-slate-950/60 border border-slate-800/70">
          <div className="mb-2 flex items-baseline justify-between text-xs font-mono">
            <span className="text-slate-400 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-cyan-400" />
              Kalan Lisans Süresi
            </span>
            <span className={`font-bold ${isLowRemaining ? "text-amber-400" : "text-cyan-300"}`}>
              {daysRemaining}{" "}
              <span className="font-normal text-slate-400">/ {totalDays} gün</span>
            </span>
          </div>

          <div className="h-2 overflow-hidden rounded-full bg-slate-800">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                isLowRemaining
                  ? "bg-gradient-to-r from-amber-500 to-red-500"
                  : "bg-gradient-to-r from-cyan-500 to-blue-500"
              }`}
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>

        {/* Fatura Bilgisi Özeti */}
        <div className="mt-4 flex items-center justify-between text-xs font-mono text-slate-400 px-1">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Fatura: {invoiceNumber}</span>
          </div>
          <button
            onClick={() => onViewInvoice(subscription)}
            className="text-cyan-400 hover:text-cyan-300 font-bold hover:underline transition flex items-center gap-1"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>İncele</span>
          </button>
        </div>
      </div>

      {/* Alt Aksiyon: Dinamik SSO "Paneline Git" Butonu */}
      <div className="relative z-10 mt-6 pt-5 border-t border-slate-800/80 flex items-center justify-between gap-3">
        <span className="text-[11px] font-mono text-slate-400">
          SSO Entegrasyonu
        </span>

        <a
          href={ssoUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs shadow-md shadow-cyan-500/20 transition flex items-center gap-2 group-hover:scale-[1.02]"
        >
          <span>Paneline Git</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>
    </article>
  );
}
