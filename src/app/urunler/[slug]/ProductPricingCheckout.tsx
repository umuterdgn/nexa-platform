"use client";

import React, { useState, useMemo } from "react";
import {
  Check,
  Sparkles,
  CreditCard,
  Building,
  Mail,
  Phone,
  User,
  Plus,
  CheckCircle2,
  Loader2,
  ShieldCheck,
  ArrowRight,
  Globe,
  Sliders,
} from "lucide-react";
import type {
  SaaSProductDetail,
  SaaSPricingPlan,
  SaaSProductAddon,
  BillingCycle,
  PricingTier,
  CheckoutResponse,
} from "@/types/saas";

interface Props {
  product: SaaSProductDetail;
}

export function ProductPricingCheckout({ product }: Props) {
  // 1. Durum Yönetimi (Checkout State)
  const [billingCycle, setBillingCycle] = useState<BillingCycle>("YEARLY");
  const [selectedTier, setSelectedTier] = useState<PricingTier>(
    product.plans.find((p) => p.isPopular)?.tier || product.plans[0]?.tier || "PRO"
  );
  const [selectedAddonKeys, setSelectedAddonKeys] = useState<string[]>([
    "extra-50-users", // Varsayılan popüler eklenti seçili
  ]);

  // Sipariş & Firma Form Modal Durumu
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState<CheckoutResponse | null>(null);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    companyName: "",
    taxNumber: "",
    taxOffice: "",
    subdomainPrefix: "",
  });

  // Seçili aktif plan
  const activePlan = useMemo(() => {
    return (
      product.plans.find((p) => p.tier === selectedTier) ||
      product.plans[0]
    );
  }, [product.plans, selectedTier]);

  // Seçili aktif eklentiler
  const selectedAddons = useMemo(() => {
    return product.addons.filter((addon) =>
      selectedAddonKeys.includes(addon.key)
    );
  }, [product.addons, selectedAddonKeys]);

  // 2. Anlık Tutar ve Fiyat Hesaplama
  const pricingCalculations = useMemo(() => {
    const isYearly = billingCycle === "YEARLY";

    // Seçilen plan birim fiyatı
    // Yıllık döngüde peşin yıllık tutar = aylık indirimli * 12
    const planMonthlyEquivalent = isYearly
      ? activePlan.yearlyPrice
      : activePlan.monthlyPrice;

    const planTotal = isYearly
      ? activePlan.yearlyPrice * 12
      : activePlan.monthlyPrice;

    // Eklentiler toplamı
    const addonsMonthlyTotal = selectedAddons.reduce((sum, addon) => {
      return sum + (isYearly ? addon.yearlyPrice : addon.monthlyPrice);
    }, 0);

    const addonsTotal = isYearly ? addonsMonthlyTotal * 12 : addonsMonthlyTotal;

    const subtotal = planTotal + addonsTotal;
    const taxRate = 0.20; // %20 KDV
    const taxAmount = Math.round(subtotal * taxRate * 100) / 100;
    const totalWithTax = Math.round((subtotal + taxAmount) * 100) / 100;

    // Yıllık tasarruf hesabı
    const monthlyNormalAnnual =
      (activePlan.monthlyPrice +
        selectedAddons.reduce((s, a) => s + a.monthlyPrice, 0)) *
      12;
    const savingsAmount = isYearly ? monthlyNormalAnnual - subtotal : 0;

    return {
      isYearly,
      planMonthlyEquivalent,
      planTotal,
      addonsMonthlyTotal,
      addonsTotal,
      subtotal,
      taxAmount,
      totalWithTax,
      savingsAmount,
      currency: activePlan.currency || "TRY",
    };
  }, [activePlan, billingCycle, selectedAddons]);

  // Eklenti Ekle / Çıkar
  const toggleAddon = (key: string) => {
    setSelectedAddonKeys((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  // 3. Checkout API Route Tetikleme (app/api/checkout/route.ts)
  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setCheckoutError(null);

    try {
      const payload = {
        productSlug: product.slug,
        productId: product.id,
        planId: activePlan.id,
        planTier: activePlan.tier,
        billingCycle,
        selectedAddonKeys,
        customer: {
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          companyName: formData.companyName,
          taxNumber: formData.taxNumber,
          taxOffice: formData.taxOffice,
          subdomainPrefix:
            formData.subdomainPrefix ||
            formData.companyName.toLowerCase().replace(/[^a-z0-9]/g, ""),
        },
      };

      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data: CheckoutResponse = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Ödeme başlatılırken bir sorun oluştu.");
      }

      setOrderSuccess(data);
    } catch (err: any) {
      setCheckoutError(err.message || "Beklenmedik bir hata oluştu.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="relative py-12" id="fiyatlandirma">
      {/* Döngü Seçici (Aylık vs Yıllık %20 Tasarruf) */}
      <div className="flex flex-col items-center justify-center mb-12">
        <span className="text-xs font-semibold tracking-wider uppercase text-indigo-400 bg-indigo-950/70 border border-indigo-500/30 px-3.5 py-1 rounded-full mb-4">
          Esnek ve Şeffaf Lisanslama
        </span>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white text-center tracking-tight">
          İşletmenizin Ölçeğine Uygun Planı Seçin
        </h2>
        <p className="text-slate-400 text-sm sm:text-base text-center max-w-2xl mt-3">
          Hiçbir gizli maliyet yok. İhtiyacınıza göre kullanıcı ve ek modülleri
          sepetinize dahil edin, bulut tenant ortamınızı anında ayağa kaldırın.
        </p>

        {/* Aylık / Yıllık Toggle Butonu */}
        <div className="mt-8 inline-flex items-center p-1.5 bg-slate-900 border border-slate-800 rounded-2xl shadow-inner">
          <button
            type="button"
            onClick={() => setBillingCycle("MONTHLY")}
            className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
              billingCycle === "MONTHLY"
                ? "bg-slate-800 text-white shadow-md border border-slate-700"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Aylık Faturalama
          </button>
          <button
            type="button"
            onClick={() => setBillingCycle("YEARLY")}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
              billingCycle === "YEARLY"
                ? "bg-gradient-to-r from-indigo-600 to-indigo-500 text-white shadow-lg shadow-indigo-500/20"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <span>Yıllık Faturalama</span>
            <span className="inline-flex items-center px-2 py-0.5 text-xs font-bold bg-emerald-500 text-slate-950 rounded-full animate-pulse">
              %20 İndirim
            </span>
          </button>
        </div>
      </div>

      {/* 3'lü SaaS Paket Tablosu (Pricing Table) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-7xl mx-auto items-stretch">
        {product.plans.map((plan) => {
          const isSelected = selectedTier === plan.tier;
          const displayPrice =
            billingCycle === "YEARLY" ? plan.yearlyPrice : plan.monthlyPrice;

          return (
            <div
              key={plan.id}
              onClick={() => setSelectedTier(plan.tier)}
              className={`relative flex flex-col justify-between rounded-3xl p-7 transition-all duration-300 cursor-pointer border ${
                isSelected
                  ? "bg-gradient-to-b from-indigo-950/60 via-slate-900 to-slate-950 border-indigo-500 ring-2 ring-indigo-500/30 shadow-2xl shadow-indigo-900/30"
                  : "bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900/80"
              }`}
            >
              {/* Popüler Rozeti */}
              {plan.isPopular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                  <span className="inline-flex items-center gap-1.5 px-4 py-1 text-xs font-bold tracking-wide uppercase bg-gradient-to-r from-indigo-500 to-cyan-500 text-white rounded-full shadow-lg shadow-indigo-500/30">
                    <Sparkles className="w-3.5 h-3.5" />
                    En Çok Tercih Edilen
                  </span>
                </div>
              )}

              <div>
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-white">{plan.name}</h3>
                  <div
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                      isSelected
                        ? "border-indigo-500 bg-indigo-600 text-white"
                        : "border-slate-700 bg-slate-800"
                    }`}
                  >
                    {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </div>
                </div>

                <p className="text-xs text-slate-400 mt-2 min-h-[36px]">
                  {plan.description}
                </p>

                {/* Fiyat Göstergesi */}
                <div className="mt-6 pb-6 border-b border-slate-800">
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                      {displayPrice.toLocaleString("tr-TR")}
                    </span>
                    <span className="text-sm font-semibold text-slate-400">
                      {plan.currency} / ay
                    </span>
                  </div>
                  {billingCycle === "YEARLY" && (
                    <p className="text-xs text-emerald-400 mt-1 font-medium">
                      Yıllık peşin {(displayPrice * 12).toLocaleString("tr-TR")}{" "}
                      {plan.currency} olarak faturalandırılır
                    </p>
                  )}
                </div>

                {/* Kota Bilgileri */}
                <div className="mt-4 grid grid-cols-2 gap-2 text-xs text-slate-300">
                  <div className="bg-slate-950/60 border border-slate-800/80 p-2 rounded-lg">
                    <span className="text-slate-500 block">Kullanıcı Kotası</span>
                    <span className="font-semibold text-white">
                      {plan.maxUsers} Kullanıcı
                    </span>
                  </div>
                  <div className="bg-slate-950/60 border border-slate-800/80 p-2 rounded-lg">
                    <span className="text-slate-500 block">Bulut Alanı</span>
                    <span className="font-semibold text-white">
                      {plan.storageGb} GB NVMe
                    </span>
                  </div>
                </div>

                {/* Paket Özellikleri */}
                <div className="mt-6">
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">
                    Paket Kapsamı:
                  </p>
                  <ul className="space-y-2.5">
                    {plan.features.map((feature, idx) => (
                      <li
                        key={idx}
                        className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-300"
                      >
                        <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Seçim Butonu */}
              <div className="mt-8 pt-4">
                <button
                  type="button"
                  onClick={() => setSelectedTier(plan.tier)}
                  className={`w-full py-3 px-4 rounded-xl text-sm font-bold transition-all duration-200 flex items-center justify-center gap-2 ${
                    isSelected
                      ? "bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30"
                      : "bg-slate-800 hover:bg-slate-700 text-slate-200"
                  }`}
                >
                  {isSelected ? "Bu Paket Seçili" : "Bu Paketi Seç"}
                  {isSelected && <ArrowRight className="w-4 h-4" />}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Eklentiler (Addons) ve Dinamik Sepet (Checkout State Bar) */}
      <div className="max-w-7xl mx-auto mt-14 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Sol Kolon: Eklenti Seçimi (Addon Selector) */}
        <div className="lg:col-span-7 bg-slate-900/60 border border-slate-800/90 rounded-3xl p-6 sm:p-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-indigo-500/10 border border-indigo-500/20 rounded-xl text-indigo-400">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">
                Modüler Eklentiler & Kapasite Artışı
              </h3>
              <p className="text-xs sm:text-sm text-slate-400">
                Şirketinizin ihtiyaç duyduğu ek lisans ve servisleri sepetinize ekleyin.
              </p>
            </div>
          </div>

          <div className="space-y-3.5 mt-6">
            {product.addons.map((addon) => {
              const isChecked = selectedAddonKeys.includes(addon.key);
              const price =
                billingCycle === "YEARLY"
                  ? addon.yearlyPrice
                  : addon.monthlyPrice;

              return (
                <div
                  key={addon.id}
                  onClick={() => toggleAddon(addon.key)}
                  className={`flex items-center justify-between p-4 rounded-2xl border transition-all duration-200 cursor-pointer ${
                    isChecked
                      ? "bg-indigo-950/40 border-indigo-500/80 shadow-md shadow-indigo-950/50"
                      : "bg-slate-950/40 border-slate-800/80 hover:border-slate-700"
                  }`}
                >
                  <div className="flex items-start gap-3.5">
                    <div
                      className={`w-5 h-5 mt-0.5 rounded-lg border flex items-center justify-center transition-colors ${
                        isChecked
                          ? "bg-indigo-600 border-indigo-500 text-white"
                          : "border-slate-700 bg-slate-900"
                      }`}
                    >
                      {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-white">
                        {addon.title}
                      </h4>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {addon.description}
                      </p>
                    </div>
                  </div>

                  <div className="text-right shrink-0 ml-4">
                    <span className="text-sm font-bold text-white block">
                      +{price.toLocaleString("tr-TR")}{" "}
                      {activePlan.currency}
                    </span>
                    <span className="text-[11px] text-slate-400">
                      /{billingCycle === "YEARLY" ? "ay" : "ay"}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Sağ Kolon: Anlık Canlı Sepet ve Satın Alma Kutusu (Checkout Summary) */}
        <div className="lg:col-span-5 flex flex-col justify-between bg-gradient-to-b from-slate-900 to-slate-950 border-2 border-indigo-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-indigo-950/40">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <span className="text-sm font-bold text-white uppercase tracking-wider">
                Sipariş & Sepet Özeti
              </span>
              <span className="text-xs font-semibold px-2.5 py-1 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-full">
                {billingCycle === "YEARLY" ? "Yıllık Lisans" : "Aylık Lisans"}
              </span>
            </div>

            {/* Kalem Kalem Fiyat Dağılımı */}
            <div className="space-y-3.5 mt-5 text-sm">
              <div className="flex justify-between items-center text-slate-300">
                <span>
                  {product.title} ({activePlan.name})
                </span>
                <span className="font-semibold text-white">
                  {pricingCalculations.planTotal.toLocaleString("tr-TR")}{" "}
                  {pricingCalculations.currency}
                </span>
              </div>

              {selectedAddons.length > 0 && (
                <div className="space-y-1.5 pt-2 border-t border-slate-800/80">
                  <span className="text-xs text-slate-500 uppercase tracking-wide block">
                    Seçilen Eklentiler:
                  </span>
                  {selectedAddons.map((addon) => {
                    const addonCost =
                      billingCycle === "YEARLY"
                        ? addon.yearlyPrice * 12
                        : addon.monthlyPrice;
                    return (
                      <div
                        key={addon.id}
                        className="flex justify-between text-xs text-slate-400 pl-2"
                      >
                        <span className="truncate max-w-[200px]">
                          • {addon.title}
                        </span>
                        <span className="font-medium text-slate-300">
                          +{addonCost.toLocaleString("tr-TR")}{" "}
                          {pricingCalculations.currency}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Ara Toplam ve KDV */}
              <div className="pt-4 border-t border-slate-800 space-y-2 text-xs">
                <div className="flex justify-between text-slate-400">
                  <span>Ara Toplam (Net):</span>
                  <span>
                    {pricingCalculations.subtotal.toLocaleString("tr-TR")}{" "}
                    {pricingCalculations.currency}
                  </span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Hesaplanan KDV (%20):</span>
                  <span>
                    {pricingCalculations.taxAmount.toLocaleString("tr-TR")}{" "}
                    {pricingCalculations.currency}
                  </span>
                </div>

                {pricingCalculations.savingsAmount > 0 && (
                  <div className="flex justify-between text-emerald-400 font-semibold bg-emerald-950/40 p-2 rounded-lg border border-emerald-500/20">
                    <span>Yıllık Peşin Tasarrufunuz:</span>
                    <span>
                      -{pricingCalculations.savingsAmount.toLocaleString("tr-TR")}{" "}
                      {pricingCalculations.currency}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Toplam Tutar ve Satın Al Butonu */}
          <div className="mt-8 pt-6 border-t border-slate-800">
            <div className="flex items-baseline justify-between mb-4">
              <div>
                <span className="text-xs text-slate-400 block">
                  Genel Toplam (KDV Dahil)
                </span>
                <span className="text-xs text-indigo-400">
                  Anında Otomatik Tenant Kurulumu
                </span>
              </div>
              <div className="text-right">
                <span className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                  {pricingCalculations.totalWithTax.toLocaleString("tr-TR")}
                </span>
                <span className="text-xs text-slate-400 ml-1">
                  {pricingCalculations.currency}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-indigo-500 via-indigo-600 to-indigo-700 hover:from-indigo-600 hover:to-indigo-800 text-white font-extrabold text-base shadow-xl shadow-indigo-600/30 hover:shadow-indigo-600/50 transition-all duration-200 flex items-center justify-center gap-2 group cursor-pointer"
            >
              <CreditCard className="w-5 h-5 group-hover:scale-110 transition-transform" />
              <span>Satın Al ve Tenant&apos;ı Başlat</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <div className="mt-4 flex items-center justify-center gap-4 text-[11px] text-slate-400">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                256-Bit SSL & 3D Secure
              </span>
              <span>•</span>
              <span>İyzico / PayTR Altyapısı</span>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================
          CHECKOUT MODALI / ADIM 2 (Firma Bilgileri & Ödeme Tetikleme)
         ======================================================== */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
          <div className="relative w-full max-w-xl bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl overflow-y-auto max-h-[90vh]">
            {/* Modal Kapatma */}
            <button
              type="button"
              onClick={() => {
                setIsModalOpen(false);
                setOrderSuccess(null);
                setCheckoutError(null);
              }}
              className="absolute top-5 right-5 text-slate-400 hover:text-white p-2 rounded-xl bg-slate-800/60"
            >
              ✕
            </button>

            {!orderSuccess ? (
              <form onSubmit={handleCheckoutSubmit}>
                <div className="mb-6">
                  <span className="text-xs font-semibold uppercase text-indigo-400 tracking-wider">
                    B2B Lisans Kurulumu
                  </span>
                  <h3 className="text-2xl font-bold text-white mt-1">
                    Firma Bilgileri & Kurulum Detayları
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Ödemeniz onaylandığı anda bu bilgiler ile bulut ortamınız ve
                    yönetici hesabınız otomatik oluşturulacaktır.
                  </p>
                </div>

                {checkoutError && (
                  <div className="mb-5 p-3.5 bg-rose-950/60 border border-rose-500/40 rounded-xl text-xs text-rose-300">
                    {checkoutError}
                  </div>
                )}

                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-medium text-slate-300 block mb-1.5">
                      Firma / Şirket Ticari Unvanı *
                    </label>
                    <div className="relative">
                      <Building className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                      <input
                        required
                        type="text"
                        placeholder="Örn: Acme Teknoloji A.Ş."
                        value={formData.companyName}
                        onChange={(e) =>
                          setFormData({ ...formData, companyName: e.target.value })
                        }
                        className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-medium text-slate-300 block mb-1.5">
                        Yetkili Adı Soyadı *
                      </label>
                      <div className="relative">
                        <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                        <input
                          required
                          type="text"
                          placeholder="Ahmet Yılmaz"
                          value={formData.fullName}
                          onChange={(e) =>
                            setFormData({ ...formData, fullName: e.target.value })
                          }
                          className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-medium text-slate-300 block mb-1.5">
                        Kurumsal E-posta (Admin) *
                      </label>
                      <div className="relative">
                        <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                        <input
                          required
                          type="email"
                          placeholder="admin@sirketiniz.com"
                          value={formData.email}
                          onChange={(e) =>
                            setFormData({ ...formData, email: e.target.value })
                          }
                          className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-medium text-slate-300 block mb-1.5">
                        İletişim Telefonu *
                      </label>
                      <div className="relative">
                        <Phone className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                        <input
                          required
                          type="tel"
                          placeholder="0532 000 00 00"
                          value={formData.phone}
                          onChange={(e) =>
                            setFormData({ ...formData, phone: e.target.value })
                          }
                          className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-medium text-slate-300 block mb-1.5">
                        İstenen Tenant Subdomain
                      </label>
                      <div className="relative">
                        <Globe className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                        <input
                          type="text"
                          placeholder="sirketim"
                          value={formData.subdomainPrefix}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              subdomainPrefix: e.target.value,
                            })
                          }
                          className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none"
                        />
                      </div>
                      <span className="text-[10px] text-slate-500 mt-1 block">
                        Giriş: {formData.subdomainPrefix || "sirketiniz"}.nxa.com.tr
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-medium text-slate-300 block mb-1.5">
                        Vergi Numarası / T.C.
                      </label>
                      <input
                        type="text"
                        placeholder="1234567890"
                        value={formData.taxNumber}
                        onChange={(e) =>
                          setFormData({ ...formData, taxNumber: e.target.value })
                        }
                        className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-slate-300 block mb-1.5">
                        Vergi Dairesi
                      </label>
                      <input
                        type="text"
                        placeholder="Kadıköy V.D."
                        value={formData.taxOffice}
                        onChange={(e) =>
                          setFormData({ ...formData, taxOffice: e.target.value })
                        }
                        className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Seçim Özeti Hatırlatma */}
                <div className="mt-6 p-4 bg-slate-950/80 border border-slate-800 rounded-2xl flex items-center justify-between text-xs">
                  <div>
                    <span className="text-slate-400 block">Ödenecek Tutar</span>
                    <span className="text-lg font-bold text-white">
                      {pricingCalculations.totalWithTax.toLocaleString("tr-TR")}{" "}
                      {pricingCalculations.currency}
                    </span>
                  </div>
                  <span className="text-slate-400">
                    {activePlan.name} (
                    {billingCycle === "YEARLY" ? "Yıllık" : "Aylık"})
                  </span>
                </div>

                {checkoutError && (
                  <div className="mt-4 p-3.5 rounded-xl border border-red-500/30 bg-red-950/40 text-xs text-red-300 flex items-center justify-between gap-2">
                    <span>{checkoutError}</span>
                    {checkoutError.includes("doğrulanmamış") && (
                      <a
                        href={`/auth/verify?email=${encodeURIComponent(formData.email)}`}
                        className="underline text-cyan-300 font-bold shrink-0 hover:text-white"
                      >
                        Şimdi Doğrula &rarr;
                      </a>
                    )}
                  </div>
                )}

                <div className="mt-6 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-5 py-2.5 rounded-xl text-sm font-semibold text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 transition"
                  >
                    Vazgeç
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 py-2.5 rounded-xl text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 transition shadow-lg shadow-indigo-600/30 flex items-center gap-2 cursor-pointer"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Sipariş Hazırlanıyor...</span>
                      </>
                    ) : (
                      <>
                        <CreditCard className="w-4 h-4" />
                        <span>Ödemeye Geç (PayTR / İyzico)</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            ) : (
              /* Sipariş Başarılı & Provisioning Bilgilendirme Ekranı */
              <div className="text-center py-6">
                <div className="w-16 h-16 bg-emerald-500/20 border border-emerald-500/40 rounded-full flex items-center justify-center mx-auto text-emerald-400 mb-4">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold text-white">
                  Sipariş Başarıyla Oluşturuldu!
                </h3>
                <p className="text-sm text-slate-300 mt-2">
                  Sipariş Numaranız:{" "}
                  <strong className="text-indigo-400">
                    {orderSuccess.orderNumber}
                  </strong>
                </p>

                <div className="mt-6 p-4 bg-slate-950 border border-slate-800 rounded-2xl text-left text-xs text-slate-300 space-y-2">
                  <p>
                    💳 <strong>Ödeme Sağlayıcı Oturumu:</strong> 3D Secure ödeme
                    sayfasına yönlendiriliyorsunuz.
                  </p>
                  <p>
                    🚀 <strong>Otomatik Provisioning:</strong> Ödeme tamamlandığında
                    sistem webhook ile tetiklenerek tenant kurulumunuzu tamamlayacak
                    ve aktivasyon şifrenizi e-posta adresinize iletecektir.
                  </p>
                </div>

                <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
                  {orderSuccess.paymentUrl ? (
                    <a
                      href={orderSuccess.paymentUrl}
                      className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-sm transition shadow-lg shadow-indigo-600/30"
                    >
                      Ödeme Sayfasına Git
                    </a>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-xl text-sm"
                    >
                      Kapat
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}

