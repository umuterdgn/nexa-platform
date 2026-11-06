"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Loader2,
  CheckCircle2,
  Sparkles,
  Link2,
  Layers,
  ArrowRight,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Search,
  DollarSign,
  HelpCircle,
  Tag,
} from "lucide-react";
import type { PricingType } from "@/types/saas";

function Field({
  label,
  required,
  hint,
  children,
}: {
  label: string;
  required?: boolean;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
          <label className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-300">
            {label} {required && <span className="text-cyan-400">*</span>}
          </label>
          {hint && <span className="text-[11px] text-slate-500 font-mono">{hint}</span>}
      </div>
      {children}
    </div>
  );
}

const inputClass =
"w-full rounded-xl border border-slate-800 bg-slate-950/80 px-4 py-3 text-sm text-white placeholder-slate-500 outline-none transition focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/30 disabled:opacity-40 disabled:cursor-not-allowed";

  export const B2B_CATEGORIES = [
    "İnşaat & ERP",
    "Franchise & Rollout",
    "Kasa/POS",
    "E-Ticaret",
    "Custom Software",
  ] as const;

  export function ProductForm({ initialProduct }: { initialProduct?: any }) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [createdProduct, setCreatedProduct] = useState<{
      slug: string;
      title: string;
      ssoUrl?: string;
    } | null>(null);

    // Form State
    const [title, setTitle] = useState(initialProduct?.title || "");
    const [slug, setSlug] = useState(initialProduct?.slug || "");
    const [category, setCategory] = useState<string>(initialProduct?.category || "İnşaat & ERP");
    const [pricingType, setPricingType] = useState<PricingType>(initialProduct?.pricingType || "SUBSCRIPTION");
    const [ssoUrl, setSsoUrl] = useState(initialProduct?.ssoUrl || initialProduct?.panelUrl || "");
    const [description, setDescription] = useState(initialProduct?.description || "");
    const [tagline, setTagline] = useState(initialProduct?.tagline || "");
    const [badge, setBadge] = useState(initialProduct?.badge || "");
    const [price, setPrice] = useState(initialProduct?.price?.toString() || initialProduct?.monthlyPrice?.toString() || "3500");
    const [discountPrice, setDiscountPrice] = useState(initialProduct?.discountPrice?.toString() || initialProduct?.yearlyPrice?.toString() || "2800");
    const [durationDays, setDurationDays] = useState(initialProduct?.durationDays?.toString() || "365");
    const [features, setFeatures] = useState(
      Array.isArray(initialProduct?.features)
        ? initialProduct.features.join(", ")
        : initialProduct?.features || ""
    );

    // Collapsible SEO State
    const [isSeoOpen, setIsSeoOpen] = useState(false);
    const [seoTitle, setSeoTitle] = useState(initialProduct?.seoTitle || "");
    const [seoDescription, setSeoDescription] = useState(initialProduct?.seoDescription || "");

    const isQuoteBased = pricingType === "QUOTE_BASED";

    // Otomatik slug ve SEO önerisi
    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = e.target.value;
      setTitle(val);
      if (!slug || slug === slugify(title)) {
        const generatedSlug = slugify(val);
        setSlug(generatedSlug);
        if (!seoTitle) {
          setSeoTitle(`${val} | Nexa B2B Kurumsal Çözüm`);
        }
      }
    };

    function slugify(text: string): string {
      return text
        .toLowerCase()
        .trim()
        .replace(/ğ/g, "g")
        .replace(/ü/g, "u")
        .replace(/ş/g, "s")
        .replace(/ı/g, "i")
        .replace(/ö/g, "o")
        .replace(/ç/g, "c")
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, "-");
    }

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
      e.preventDefault();
      setLoading(true);
      setError("");
      setCreatedProduct(null);

      try {
        const res = await fetch("/api/admin/products", {
          method: initialProduct ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title,
            slug,
            ssoUrl,
            description,
            tagline,
            category,
            pricingType,
            seoTitle: seoTitle || undefined,
            seoDescription: seoDescription || undefined,
            badge: badge || undefined,
            price: isQuoteBased ? 0 : Number(price || 0),
            discountPrice: isQuoteBased ? 0 : Number(discountPrice || price || 0),
            durationDays: pricingType === "ONE_TIME" ? 0 : Number(durationDays),
            features,
          }),
        });

        const data = await res.json();
        setLoading(false);

        if (!res.ok || data.error) {
          setError(data.error ?? "Kayıt başarısız oldu.");
          return;
        }

        setCreatedProduct({
          slug: data.slug || slug,
          title,
          ssoUrl,
        });

        router.refresh();
      } catch (err: any) {
        setLoading(false);
        setError("Bağlantı hatası oluştu.");
      }
    }

    return (
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* BAŞARILI KAYIT BİLGİLENDİRMESİ */}
        {createdProduct && (
          <div className="p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 space-y-3 animate-fadeIn">
            <div className="flex items-center gap-2.5 text-emerald-400 font-bold text-sm">
              <CheckCircle2 className="w-5 h-5" />
              <span>{createdProduct.title} Başarıyla Prisma Veritabanına Eklendi / Güncellendi!</span>
            </div>
            <p className="text-xs text-slate-300">
              Ürün vitrin sayfası (/urunler/{createdProduct.slug}), kategori listesi ve Dinamik SSO yönlendirmesi anında aktifleşti.
            </p>
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link
                href={`/urunler/${createdProduct.slug}`}
                target="_blank"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition shadow-md"
              >
                <span>Canlı Sayfayı Gör (/urunler/{createdProduct.slug})</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
              {createdProduct.ssoUrl && (
                <a
                  href={`/sso?slug=${createdProduct.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 font-bold text-xs transition border border-cyan-500/30"
                >
                  <span>SSO Yönlendirmesini Test Et</span>
                  <Link2 className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          </div>
        )}

        {error && (
            <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-mono">
              {error}
            </div>
      )}

            {/* 1. ÜRÜN ADI & URL SLUGU */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <Field label="Ürün Adı" required hint="Örn: Nexa ERP, Nexa Franchise">
                  <input
                    name="title"
                    required
                    value={title}
                    onChange={handleTitleChange}
                    className={inputClass}
                    placeholder="Nexa ERP Cloud"
                  />
                </Field>

                  <Field label="URL Slugu (Benzersiz)" required hint="Örn: nexa-erp, nexa-franchise">
                    <div className="relative">
                      <input
                        name="slug"
                        required
                        value={slug}
                        onChange={(e) => setSlug(e.target.value)}
                        className={`${inputClass} font-mono text-cyan-300`}
                        placeholder="nexa-erp"
                      />
                    </div>
                  </Field>
                </div>

                {/* 2. KATEGORİ SEÇİMİ & FİYATLANDIRMA MODELİ */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <Field label="B2B SaaS Kategorisi" required hint="Admin ve vitrinde gruplama">
                    <select
                      name="category"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className={inputClass}
                    >
                      {B2B_CATEGORIES.map((cat) => (
                        <option key={cat} value={cat} className="bg-slate-900 text-white">
                          {cat}
                        </option>
                      ))}
                    </select>
                  </Field>

                  <Field label="Fiyatlandırma Modeli (Pricing Type)" required hint="Abonelik, Tek Seferlik veya Özel Teklif">
                    <select
                      name="pricingType"
                      value={pricingType}
                      onChange={(e) => setPricingType(e.target.value as PricingType)}
                      className={`${inputClass} ${isQuoteBased
                          ? "border-amber-500/50 text-amber-300 font-bold"
                          : pricingType === "ONE_TIME"
                            ? "border-purple-500/50 text-purple-300 font-bold"
                            : "border-cyan-500/50 text-cyan-300 font-bold"
                        }`}
                    >
                      <option value="SUBSCRIPTION" className="bg-slate-900 text-white">
                        📅 Abonelik (Aylık & Yıllık Plan)
                      </option>
                      <option value="ONE_TIME" className="bg-slate-900 text-white">
                        ⚡ Tek Seferlik (Örn: Jeton, Lisans Devri)
                      </option>
                      <option value="QUOTE_BASED" className="bg-slate-900 text-white">
                        🏢 Özel Teklif (Teklife Dayalı Enterprise Satış)
                      </option>
                    </select>
                  </Field>
                </div>

                {/* 3. YÖNETİM PANELİ SSO URL */}
                <Field
                  label="Yönetim Paneli SSO URL"
                  hint="Satın alan müşterinin 'Paneline Git' tıklandığında yönlendirileceği adres"
                >
                  <div className="relative">
                    <input
                      name="ssoUrl"
                      value={ssoUrl}
                      onChange={(e) => setSsoUrl(e.target.value)}
                      className={`${inputClass} font-mono`}
                      placeholder="https://erp.nxa.com.tr/auth/sso"
                    />
                    <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none">
                      <Link2 className="w-4 h-4 text-cyan-400" />
                    </div>
                  </div>
                </Field>

                  {/* 4. SLOGAN (TAGLINE) & ROZET (BADGE) */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <Field label="Kısa Slogan (Tagline)" hint="Hero başlık altı vurucu cümle">
                      <input
                        name="tagline"
                        value={tagline}
                        onChange={(e) => setTagline(e.target.value)}
                        className={inputClass}
                        placeholder="%100 Çevrimdışı PWA & 3D BIM Hakediş Blokesi"
                      />
                    </Field>

                    <Field label="Vitrindeki Rozet (Badge)" hint="Örn: 3D BIM, Rollout & Multi-Store OS">
                      <input
                        name="badge"
                        value={badge}
                        onChange={(e) => setBadge(e.target.value)}
                        className={inputClass}
                        placeholder="En Çok Satan Kurumsal Çözüm"
                      />
                    </Field>
                  </div>

                  {/* 5. AÇIKLAMA */}
                  <Field label="Ürün Açıklaması (GEO & LLM Uyumlu)" required hint="Kullanıcı niyeti ve teknik mimari">
                    <textarea
                      name="description"
                      required
                      rows={3}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className={inputClass}
                      placeholder="İnşaat ortak veri ortamı (CDE - ISO 19650), Dexie.js offline-first mimarisi ve YİBF uyumlu hakediş kontrolü sağlayan bulut ERP..."
                    />
                  </Field>

                  {/* 6. FİYATLAR (NORMAL & İNDİRİMLİ/YILLIK) */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div>
                        <Field
                          label="Normal Fiyat (Aylık ₺)"
                          required={!isQuoteBased}
                          hint={isQuoteBased ? "Özel teklifte devre dışıdır" : "Aylık baz tutar"}
                        >
                    <div className="relative">
                      <input
                        name="price"
                        type="number"
                        min={0}
                        disabled={isQuoteBased}
                        required={!isQuoteBased}
                        value={isQuoteBased ? "" : price}
                        onChange={(e) => setPrice(e.target.value)}
                        className={`${inputClass} font-mono`}
                        placeholder={isQuoteBased ? "Teklife Dayalı" : "3500"}
                      />
                      <DollarSign className="w-4 h-4 text-slate-500 absolute right-3.5 top-3.5 pointer-events-none" />
                    </div>
                </Field>
            </div>

            <div>
              <Field
                label="İndirimli / Yıllık Fiyat (₺)"
                hint={isQuoteBased ? "Özel teklifte devre dışıdır" : "Yıllıkta aylık karşılığı"}
              >
                <div className="relative">
                  <input
                    name="discountPrice"
                    type="number"
                    min={0}
                    disabled={isQuoteBased}
                    value={isQuoteBased ? "" : discountPrice}
                    onChange={(e) => setDiscountPrice(e.target.value)}
                    className={`${inputClass} font-mono text-emerald-400`}
                    placeholder={isQuoteBased ? "Teklif Usulü" : "2800"}
                  />
                  <Tag className="w-4 h-4 text-emerald-500/70 absolute right-3.5 top-3.5 pointer-events-none" />
                </div>
              </Field>
            </div>

            <div>
              <Field label="Lisans Süresi" hint="Gün sayısı">
                <select
                  name="durationDays"
                  disabled={isQuoteBased || pricingType === "ONE_TIME"}
                  value={durationDays}
                  onChange={(e) => setDurationDays(e.target.value)}
                  className={inputClass}
                >
                  <option value="365" className="bg-slate-900 text-white">1 Yıl (365 Gün - Yıllık Plan)</option>
                  <option value="30" className="bg-slate-900 text-white">1 Ay (30 Gün - Aylık)</option>
                  <option value="0" className="bg-slate-900 text-white">Süresiz / Proje Bazlı</option>
                </select>
              </Field>
            </div>
          </div>

          {isQuoteBased && (
            <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs flex items-center gap-2">
              <HelpCircle className="w-4 h-4 shrink-0 text-amber-400" />
              <span>
                <strong>Özel Teklif (QUOTE_BASED) Seçildi:</strong> Sabit fiyat vitrinde gösterilmez; kullanıcılar &quot;Teklif İste / Strateji Toplantısı&quot; butonuna yönlendirilir.
              </span>
            </div>
          )}

        {/* 7. ÖNE ÇIKAN ÖZELLİKLER */}
        <Field
          label="Öne Çıkan Özellikler (Features)"
          hint="Virgülle ayırarak giriniz"
        >
          <input
            name="features"
            value={features}
            onChange={(e) => setFeatures(e.target.value)}
            className={inputClass}
            placeholder="%100 Çevrimdışı PWA, 3D BIM Modeli, Dexie.js Entegrasyonu, YİBF Denetim, SAP/OData Bağlantısı"
          />
        </Field>

        {/* 8. COLLAPSIBLE GEO & LLM SEO ACCORDION */}
        <div className="border border-slate-800 rounded-2xl bg-slate-950/50 overflow-hidden">
          <button
            type="button"
            onClick={() => setIsSeoOpen(!isSeoOpen)}
            className="w-full p-4 flex items-center justify-between text-left hover:bg-slate-900/50 transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <Search className="w-4 h-4 text-cyan-400" />
              <div>
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-white">
                  GEO & LLM Arama Motoru Optimizasyonu (SEO Metadata)
                </span>
                <p className="text-[11px] text-slate-400">
                  ChatGPT, Gemini ve Google arama niyetleri için özel başlık ve açıklama girin.
                </p>
              </div>
            </div>
            {isSeoOpen ? (
              <ChevronUp className="w-4 h-4 text-slate-400" />
            ) : (
              <ChevronDown className="w-4 h-4 text-slate-400" />
            )}
          </button>

          {isSeoOpen && (
            <div className="p-5 border-t border-slate-800/80 space-y-4 bg-slate-950/70">
              <Field
                label="SEO Başlığı (Meta Title)"
                hint="Max 60 karakter önerilir"
              >
                <input
                  name="seoTitle"
                  value={seoTitle}
                  onChange={(e) => setSeoTitle(e.target.value)}
                  className={inputClass}
                  placeholder="Nexa ERP | İnşaat ve Şantiye CDE Platformu"
                />
              </Field>

              <Field
                label="SEO Açıklaması (Meta Description)"
                hint="Max 160 karakter önerilir"
              >
                <textarea
                  name="seoDescription"
                  rows={2}
                  value={seoDescription}
                  onChange={(e) => setSeoDescription(e.target.value)}
                  className={inputClass}
                  placeholder="İnternetsiz şantiyede hakediş veri girişi sağlayan Dexie.js mimarisi, 3D BIM hakediş blokesi ve YİBF uyumlu inşaat ERP platformu."
                />
              </Field>
            </div>
          )}
        </div>

        {/* GÖNDER BUTONU */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-4 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-sm shadow-lg shadow-cyan-500/25 transition flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Prisma Veritabanına Yazılıyor...</span>
            </>
          ) : (
            <>
              <span>{initialProduct ? "Değişiklikleri Prisma'ya Kaydet" : "Ürünü ve SSO Entegrasyonunu Prisma'ya Kaydet"}</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>
    );
  }
