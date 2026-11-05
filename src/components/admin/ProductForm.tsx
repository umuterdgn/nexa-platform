"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Loader2,
  CheckCircle2,
  Sparkles,
  Link2,
  Lock,
  Layers,
  ArrowRight,
  ExternalLink,
} from "lucide-react";

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
        <label className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-400">
          {label} {required && <span className="text-cyan-400">*</span>}
        </label>
        {hint && <span className="text-[11px] text-slate-500 font-mono">{hint}</span>}
      </div>
      {children}
    </div>
  );
}

const inputClass =
  "w-full rounded-xl border border-slate-800 bg-slate-950/70 px-4 py-3 text-sm text-white placeholder-slate-500 outline-none transition focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/30";

export function ProductForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [createdProduct, setCreatedProduct] = useState<{
    slug: string;
    title: string;
    ssoUrl?: string;
  } | null>(null);

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [ssoUrl, setSsoUrl] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState<"saas" | "service">("saas");
  const [badge, setBadge] = useState("");
  const [price, setPrice] = useState("");
  const [discountPrice, setDiscountPrice] = useState("");
  const [durationDays, setDurationDays] = useState("365");
  const [features, setFeatures] = useState("");

  // Otomatik slug önerisi
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setTitle(val);
    if (!slug || slug === slugify(title)) {
      setSlug(slugify(val));
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
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          slug,
          ssoUrl,
          description,
          type,
          badge,
          price: Number(price),
          discountPrice: Number(discountPrice || price),
          durationDays: Number(durationDays),
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
            <span>{createdProduct.title} Başarıyla Prisma Veritabanına Eklendi!</span>
          </div>
          <p className="text-xs text-slate-300">
            Ürün vitrin sayfası ve Dinamik SSO yönlendirmesi anında aktifleşti.
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
                <span>SSO Testini Çalıştır</span>
                <Link2 className="w-3.5 h-3.5" />
              </a>
            )}
          </div>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-mono">
          {error}
        </div>
      )}

      {/* 1. ÜRÜN ADI & URL SLUGU (BENZERSİZ) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <Field label="Ürün Adı" required hint="Örn: Tam Vaktinde, Nexa POS">
          <input
            name="title"
            required
            value={title}
            onChange={handleTitleChange}
            className={inputClass}
            placeholder="Nexa ERP Cloud"
          />
        </Field>

        <Field label="URL Slugu (Benzersiz)" required hint="Örn: ai_token_5, nexa-erp">
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

      {/* 2. YÖNETİM PANELİ SSO URL */}
      <Field
        label="Yönetim Paneli SSO URL"
        required
        hint="Hedef uygulama tek oturum açma adresi"
      >
        <div className="relative">
          <input
            name="ssoUrl"
            required
            value={ssoUrl}
            onChange={(e) => setSsoUrl(e.target.value)}
            className={`${inputClass} font-mono`}
            placeholder="https://tamvaktinde.com.tr/auth/sso"
          />
          <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none">
            <Link2 className="w-4 h-4 text-cyan-400" />
          </div>
        </div>
      </Field>

      {/* 3. AÇIKLAMA */}
      <Field label="Ürün Açıklaması (GEO & SEO Uyumlu)" required>
        <textarea
          name="description"
          required
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className={inputClass}
          placeholder="İnşaat ortak veri ortamı (CDE), Dexie.js offline-first senkronizasyon ve 3D BIM hakediş blokesi sağlayan kurumsal SaaS..."
        />
      </Field>

      {/* 4. TÜR, ROZET & LİSANS SÜRESİ */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <Field label="Ürün Türü">
          <select
            name="type"
            value={type}
            onChange={(e) => setType(e.target.value as any)}
            className={inputClass}
          >
            <option value="saas">SaaS Bulut Platformu</option>
            <option value="service">Ajans / Özel Mühendislik</option>
          </select>
        </Field>

        <Field label="Rozet / Etiket" hint="Örn: 3D BIM, Yeni, Jeton">
          <input
            name="badge"
            value={badge}
            onChange={(e) => setBadge(e.target.value)}
            className={inputClass}
            placeholder="En Çok Satan"
          />
        </Field>

        <Field label="Lisans Süresi" hint="Gün sayısı">
          <select
            name="durationDays"
            value={durationDays}
            onChange={(e) => setDurationDays(e.target.value)}
            className={inputClass}
          >
            <option value="365">1 Yıl (365 Gün - Yıllık Plan)</option>
            <option value="30">1 Ay (30 Gün - Aylık)</option>
            <option value="3650">Süresiz (Jeton Paketi)</option>
          </select>
        </Field>
      </div>

      {/* 5. FİYATLAR (NORMAL & İNDİRİMLİ/YILLIK) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <Field label="Normal Fiyat (Aylık ₺)" required>
          <input
            name="price"
            type="number"
            min={0}
            required
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className={`${inputClass} font-mono`}
            placeholder="2990"
          />
        </Field>

        <Field label="İndirimli / Yıllık Fiyat (₺)" hint="Yıllıkta aylık karşılığı">
          <input
            name="discountPrice"
            type="number"
            min={0}
            value={discountPrice}
            onChange={(e) => setDiscountPrice(e.target.value)}
            className={`${inputClass} font-mono text-emerald-400`}
            placeholder="2390"
          />
        </Field>
      </div>

      {/* 6. ÖNE ÇIKAN ÖZELLİKLER */}
      <Field
        label="Öne Çıkan Özellikler"
        hint="Virgülle ayırarak yazınız"
      >
        <input
          name="features"
          value={features}
          onChange={(e) => setFeatures(e.target.value)}
          className={inputClass}
          placeholder="%100 Çevrimdışı PWA, 3D BIM Modeli, Dexie.js Entegrasyonu, YİBF Denetim"
        />
      </Field>

      {/* GÖNDER BUTONU */}
      <button
        type="submit"
        disabled={loading}
        className="w-full py-4 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-sm shadow-lg shadow-cyan-500/25 transition flex items-center justify-center gap-2 disabled:opacity-50"
      >
        {loading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Prisma Veritabanına Yazılıyor...</span>
          </>
        ) : (
          <>
            <span>Ürünü ve SSO Entegrasyonunu Prisma&apos;ya Kaydet</span>
            <ArrowRight className="w-4 h-4" />
          </>
        )}
      </button>
    </form>
  );
}
