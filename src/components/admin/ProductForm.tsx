"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-slate-500">
        {label}
      </span>
      {children}
    </label>
  );
}

const inputClass =
  "w-full rounded-xl border border-white/10 bg-black/60 px-4 py-3 text-sm text-white outline-none transition focus:border-[#1D4ED8] focus:ring-2 focus:ring-[#1D4ED8]/25";

export function ProductForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    const form = new FormData(e.currentTarget);
    const body = {
      title: form.get("title"),
      description: form.get("description"),
      price: form.get("price"),
      features: form.get("features"),
      type: form.get("type"),
    };

    const res = await fetch("/api/admin/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error ?? "Kayıt başarısız.");
      return;
    }

    setSuccess("Ürün başarıyla eklendi.");
    e.currentTarget.reset();
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <Field label="Ürün Adı">
        <input name="title" required className={inputClass} placeholder="Nexa Randevu" />
      </Field>

      <Field label="Açıklama">
        <textarea
          name="description"
          required
          rows={3}
          className={inputClass}
          placeholder="Kısa ürün açıklaması..."
        />
      </Field>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Fiyat (₺)">
          <input
            name="price"
            type="number"
            min={0}
            required
            className={inputClass}
            placeholder="499"
          />
        </Field>

        <Field label="Tür">
          <select name="type" defaultValue="saas" className={inputClass}>
            <option value="saas">SaaS</option>
            <option value="service">Hizmet</option>
          </select>
        </Field>
      </div>

      <Field label="Özellikler (virgülle ayırın)">
        <input
          name="features"
          className={inputClass}
          placeholder="Sınırsız randevu, SMS hatırlatma, Takvim sync"
        />
      </Field>

      {error && (
        <p className="rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-400">{error}</p>
      )}
      {success && (
        <p className="rounded-lg bg-emerald-500/10 px-3 py-2 text-sm text-emerald-400">
          {success}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#1D4ED8] py-3 text-sm font-semibold text-white hover:bg-[#2563EB] disabled:opacity-60"
      >
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Ürünü Kaydet"}
      </button>
    </form>
  );
}
