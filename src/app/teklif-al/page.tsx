"use client";

import { useState } from "react";

export default function TeklifAlPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg("");

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email");
    const phone = formData.get("phone");

    // E-posta veya telefondan en az biri girilmeli
    if (!email && !phone) {
      setErrorMsg(
        "Lütfen size ulaşabilmemiz için e-posta veya telefon numaranızı girin.",
      );
      setIsSubmitting(false);
      return;
    }

    try {
      const res = await fetch("/api/teklif", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        setIsSuccess(true);
      } else {
        setErrorMsg("Bir hata oluştu. Lütfen tekrar deneyin.");
      }
    } catch (error) {
      console.error("Form gönderim hatası:", error);
      setErrorMsg("Bir hata oluştu.");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isSuccess) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black px-4">
        <div className="max-w-md rounded-2xl border border-white/10 bg-[#0F172A]/40 p-10 text-center backdrop-blur-xl">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-500">
            <svg
              className="h-8 w-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h2 className="mb-2 font-display text-2xl font-bold text-white">
            Talebiniz Alındı!
          </h2>
          <p className="text-slate-400">
            Proje detaylarınız ekibimize ulaştı. En kısa sürede inceleyip size
            özel bir teklif ile dönüş yapacağız.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black px-4 py-24 sm:px-6">
      <div className="mx-auto max-w-3xl">
        <div className="mb-10 text-center">
          <p className="text-sm font-medium uppercase tracking-widest text-[#3B82F6]">
            Nexa Dijital
          </p>
          <h1 className="mt-2 font-display text-4xl font-bold text-white sm:text-5xl">
            Projenden Bahset
          </h1>
          <p className="mt-4 text-lg text-slate-400">
            Fikrini hayata geçirmek için ilk adımı at. Detayları paylaş, sana
            özel bir yol haritası ve teklif hazırlayalım.
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-[#0F172A]/40 p-6 backdrop-blur-xl sm:p-10">
          <form onSubmit={onSubmit} className="space-y-6">
            {errorMsg && (
              <div className="rounded-lg bg-red-500/10 p-4 text-sm text-red-500 border border-red-500/20">
                {errorMsg}
              </div>
            )}

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Adınız Soyadınız *
              </label>
              <input
                type="text"
                name="name"
                required
                className="w-full rounded-xl border border-white/10 bg-black/50 px-4 py-3 text-white placeholder-slate-500 outline-none focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6]"
                placeholder="Örn: Umut Erdoğan"
              />
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  E-posta Adresiniz
                </label>
                <input
                  type="email"
                  name="email"
                  className="w-full rounded-xl border border-white/10 bg-black/50 px-4 py-3 text-white placeholder-slate-500 outline-none focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6]"
                  placeholder="ornek@sirket.com"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Telefon Numaranız
                </label>
                <input
                  type="tel"
                  name="phone"
                  className="w-full rounded-xl border border-white/10 bg-black/50 px-4 py-3 text-white placeholder-slate-500 outline-none focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6]"
                  placeholder="05XX XXX XX XX"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Proje Detayları *
              </label>
              <textarea
                name="details"
                required
                rows={5}
                className="w-full rounded-xl border border-white/10 bg-black/50 px-4 py-3 text-white placeholder-slate-500 outline-none focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6]"
                placeholder="Nasıl bir hizmete ihtiyacınız var? Projenizin hedefleri neler?"
              ></textarea>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Referans Görsel / Dosya (İsteğe Bağlı)
              </label>
              <input
                type="file"
                name="file"
                accept="image/*,.pdf"
                className="w-full rounded-xl border border-white/10 bg-black/50 px-4 py-3 text-sm text-slate-300 file:mr-4 file:rounded-full file:border-0 file:bg-[#3B82F6]/10 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-[#3B82F6] hover:file:bg-[#3B82F6]/20"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-xl bg-gradient-to-r from-[#3B82F6] to-[#2563EB] px-8 py-4 font-semibold text-white transition-all hover:scale-[1.02] disabled:opacity-70 disabled:hover:scale-100"
            >
              {isSubmitting ? "Gönderiliyor..." : "Teklif İste"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
