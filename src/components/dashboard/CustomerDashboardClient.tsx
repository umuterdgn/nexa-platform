"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Sparkles,
  Plus,
  ShieldCheck,
  Zap,
  Clock,
  Layers,
  ArrowRight,
  ExternalLink,
  Store,
  RefreshCw,
  CheckCircle2,
} from "lucide-react";
import type { CustomerSubscription } from "@/types/saas";
import { ActiveProductCard } from "./ActiveProductCard";
import { InvoiceModal } from "./InvoiceModal";
import { QuickStoreModal } from "./QuickStoreModal";

interface CustomerDashboardClientProps {
  initialSubscriptions: CustomerSubscription[];
  userName: string;
  userEmail: string;
}

export function CustomerDashboardClient({
  initialSubscriptions,
  userName,
  userEmail,
}: CustomerDashboardClientProps) {
  const [subscriptions, setSubscriptions] = useState<CustomerSubscription[]>(initialSubscriptions);
  const [selectedInvoiceSub, setSelectedInvoiceSub] = useState<CustomerSubscription | null>(null);
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState<boolean>(false);
  const [isStoreModalOpen, setIsStoreModalOpen] = useState<boolean>(false);

  const activeCount = subscriptions.filter((s) => s.status === "active").length;
  const closestRenewalDays = Math.min(...subscriptions.map((s) => s.daysRemaining));

  const handleOpenInvoice = (sub: CustomerSubscription) => {
    setSelectedInvoiceSub(sub);
    setIsInvoiceModalOpen(true);
  };

  const handleSubscriptionAdded = (newSub: CustomerSubscription) => {
    setSubscriptions((prev) => {
      const filtered = prev.filter((s) => s.productSlug !== newSub.productSlug);
      return [newSub, ...filtered];
    });
  };

  return (
    <div className="space-y-12">
      {/* 1. ÜST KPI / LİSANS DURUM KARTLARI */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Aktif Lisans Sayısı */}
        <div className="p-6 rounded-3xl bg-slate-900/40 border border-slate-800/80 backdrop-blur-xl">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400">
            <span>Aktif SaaS Ürünü</span>
            <span className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400">
              <Layers className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-3 text-3xl font-black text-white">
            {activeCount}{" "}
            <span className="text-sm font-normal text-slate-400 font-mono">Hizmet</span>
          </div>
          <p className="mt-2 text-xs text-emerald-400 font-mono flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Tüm tenantlar yayında</span>
          </p>
        </div>

        {/* SSO Güvenlik Durumu */}
        <div className="p-6 rounded-3xl bg-slate-900/40 border border-slate-800/80 backdrop-blur-xl">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400">
            <span>Dinamik SSO Koruması</span>
            <span className="p-2 rounded-xl bg-blue-500/10 text-blue-400">
              <ShieldCheck className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-3 text-2xl font-black text-white">
            %100 Güvenli
          </div>
          <p className="mt-2 text-xs text-cyan-400 font-mono">
            JWT Biletli Tek Tıkla Giriş
          </p>
        </div>

        {/* En Yakın Yenileme */}
        <div className="p-6 rounded-3xl bg-slate-900/40 border border-slate-800/80 backdrop-blur-xl">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400">
            <span>En Yakın Yenileme</span>
            <span className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
              <Clock className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-3 text-3xl font-black text-white">
            {isFinite(closestRenewalDays) ? closestRenewalDays : 365}{" "}
            <span className="text-sm font-normal text-slate-400 font-mono">gün</span>
          </div>
          <p className="mt-2 text-xs text-slate-400 font-mono">
            Otomatik Kesintisiz Hizmet
          </p>
        </div>

        {/* Yeni Hizmet Satın Alma Hızlı Butonu */}
        <div
          onClick={() => setIsStoreModalOpen(true)}
          className="group cursor-pointer p-6 rounded-3xl bg-gradient-to-br from-cyan-950/40 via-blue-950/30 to-slate-900/50 border border-cyan-500/30 hover:border-cyan-400 hover:shadow-[0_0_30px_rgba(6,182,212,0.15)] transition-all flex flex-col justify-between"
        >
          <div className="flex items-center justify-between text-xs font-mono text-cyan-300">
            <span>Hızlı Satın Alma</span>
            <span className="p-2 rounded-xl bg-cyan-500/20 text-cyan-300 group-hover:scale-110 transition">
              <Plus className="w-4 h-4" />
            </span>
          </div>
          <div>
            <div className="text-lg font-black text-white group-hover:text-cyan-300 transition">
              + Yeni Ürün & Jeton Ekle
            </div>
            <p className="text-xs text-slate-300 mt-1">
              Panelden çıkmadan anında yetki al
            </p>
          </div>
        </div>
      </section>

      {/* 2. AKTİF ÜRÜNLERİM VE LİSANS YÖNETİMİ BÖLÜMÜ */}
      <section className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div>
            <span className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-bold block">
              Kurumsal Bulut Hizmetleri
            </span>
            <h2 className="text-2xl font-black text-white tracking-tight">
              Aktif Lisanslarım & Yönetim Panelleri
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsStoreModalOpen(true)}
              className="px-5 py-2.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 font-bold text-xs transition flex items-center gap-2"
            >
              <Store className="w-3.5 h-3.5" />
              <span>Ürün & Jeton Mağazası</span>
            </button>
          </div>
        </div>

        {subscriptions.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-slate-800 bg-slate-900/30 p-12 text-center">
            <p className="text-slate-400 text-sm">Henüz aktif bir aboneliğiniz bulunmuyor.</p>
            <button
              onClick={() => setIsStoreModalOpen(true)}
              className="mt-4 px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-xs shadow-lg shadow-cyan-500/20 hover:scale-105 transition"
            >
              Hemen İlk Ürününüzü Ekleyin
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {subscriptions.map((sub) => (
              <ActiveProductCard
                key={sub.id}
                subscription={sub}
                onViewInvoice={handleOpenInvoice}
              />
            ))}
          </div>
        )}
      </section>

      {/* 3. DİNAMİK SSO VE TEKNİK ENTEGRASYON BİLGİ KUTUSU */}
      <section className="p-8 rounded-3xl bg-slate-900/30 border border-slate-800/80 text-xs sm:text-sm text-slate-300 space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-white text-base">
              Nexa Dinamik SSO (Single Sign-On) Mimarisi Nasıl Çalışır?
            </h3>
            <p className="text-slate-400 text-xs mt-0.5 font-mono">
              Sıfır şifre girişi &bull; Kriptografik JWT doğrulama &bull; 5 dakikalık tek kullanımlık bilet
            </p>
          </div>
        </div>

        <p className="leading-relaxed">
          Satın aldığınız her hizmetin (<strong className="text-white">Tam Vaktinde</strong>,{" "}
          <strong className="text-emerald-400">Nexa ERP</strong>,{" "}
          <strong className="text-cyan-400">Nexa POS</strong> vb.) yanında yer alan{" "}
          <strong className="text-cyan-300">"Paneline Git"</strong> butonuna tıkladığınızda, Nexa Identity Gateway
          sizin adınıza geçici bir kriptografik bilet (HMAC-SHA256 imzalı JWT) oluşturur ve hedef ürünün SSO uç noktasına
          güvenli şekilde aktarır. Böylece harici panellere tekrar kullanıcı adı veya şifre girmeden kendi izole tenant&apos;ınıza anında giriş yaparsınız.
        </p>
      </section>

      {/* 4. MODALLAR: FATURA & HIZLI MAĞAZA */}
      <InvoiceModal
        subscription={selectedInvoiceSub}
        isOpen={isInvoiceModalOpen}
        onClose={() => setIsInvoiceModalOpen(false)}
      />

      <QuickStoreModal
        isOpen={isStoreModalOpen}
        onClose={() => setIsStoreModalOpen(false)}
        onSubscriptionAdded={handleSubscriptionAdded}
      />
    </div>
  );
}

