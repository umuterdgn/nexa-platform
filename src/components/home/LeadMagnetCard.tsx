"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FileText, Download, CheckCircle2, ArrowRight, Sparkles, Lock } from "lucide-react";

export function LeadMagnetCard({
  source = "Digitalization_PDF_Report",
  title = "2026 B2B Dijitalleşme & Operasyon Raporunu İndirin",
  subtitle = "Şirketinizde manuel operasyon maliyetlerini %40 düşürme teknikleri, ERP entegrasyonu ve otonom iş akışları rehberi.",
}: {
  source?: string;
  title?: string;
  subtitle?: string;
}) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      setStatus("error");
      setErrorMessage("Lütfen geçerli bir kurumsal e-posta adresi giriniz.");
      return;
    }

    try {
      setStatus("loading");
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setStatus("success");
      } else {
        setStatus("error");
        setErrorMessage(data.error || "Bir hata oluştu, lütfen tekrar deneyin.");
      }
    } catch (err: any) {
      setStatus("error");
      setErrorMessage("Bağlantı hatası: " + err.message);
    }
  };

  return (
    <div className="relative mx-auto my-12 max-w-4xl overflow-hidden rounded-3xl border border-emerald-500/30 bg-gradient-to-r from-zinc-950 via-zinc-900/90 to-zinc-950 p-8 sm:p-12 shadow-[0_0_50px_rgba(16,185,129,0.12)] backdrop-blur-2xl">
      {/* Background Accent Mesh */}
      <div className="pointer-events-none absolute -top-24 right-1/4 h-64 w-64 rounded-full bg-emerald-500/10 blur-[100px]" />

      <div className="relative flex flex-col lg:flex-row items-center justify-between gap-8">
        {/* Left Content */}
        <div className="max-w-xl text-left">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-1 text-xs font-mono font-medium text-emerald-400">
            <Sparkles className="h-3.5 w-3.5" />
            Ücretsiz B2B Yönetici Raporu (PDF)
          </div>

          <h3 className="mt-4 font-display text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-snug">
            {title}
          </h3>

          <p className="mt-3 text-xs sm:text-sm text-zinc-300 leading-relaxed">
            {subtitle}
          </p>

          <div className="mt-4 flex items-center gap-4 text-xs text-zinc-400 font-mono">
            <span className="flex items-center gap-1.5 text-emerald-400">
              <CheckCircle2 className="h-3.5 w-3.5" /> 42 Sayfalık Analiz
            </span>
            <span>&bull;</span>
            <span className="flex items-center gap-1.5 text-blue-400">
              <FileText className="h-3.5 w-3.5" /> Gerçek Vaka Verileri
            </span>
            <span>&bull;</span>
            <span className="flex items-center gap-1.5 text-zinc-400">
              <Lock className="h-3.5 w-3.5" /> Sıfır Spam
            </span>
          </div>
        </div>

        {/* Right Form / Success Card */}
        <div className="w-full lg:max-w-sm">
          <AnimatePresence mode="wait">
            {status === "success" ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="rounded-2xl border border-emerald-500/40 bg-emerald-500/10 p-6 text-center space-y-2 backdrop-blur-md shadow-[0_0_25px_rgba(16,185,129,0.2)]"
              >
                <div className="flex h-12 w-12 mx-auto items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                  <CheckCircle2 className="h-6 w-6" />
                </div>
                <h4 className="font-display text-base font-bold text-white">
                  Raporunuz Gönderildi! 🎉
                </h4>
                <p className="text-xs text-zinc-300">
                  <strong className="text-emerald-400">{email}</strong> adresinize indirme bağlantısı iletildi. Lütfen gelen kutunuzu (veya spam klasörünü) kontrol ediniz.
                </p>
              </motion.div>
            ) : (
              <motion.form
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                onSubmit={handleSubmit}
                className="rounded-2xl border border-white/10 bg-zinc-950/80 p-5 space-y-3 backdrop-blur-md shadow-xl"
              >
                <div>
                  <label className="block text-xs font-mono text-zinc-300 mb-1.5">
                    Kurumsal E-posta Adresiniz
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (status === "error") setStatus("idle");
                    }}
                    placeholder="ad.soyad@sirketiniz.com"
                    className="w-full rounded-xl border border-white/10 bg-zinc-900 px-3.5 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500/50"
                  />
                  {status === "error" && (
                    <p className="mt-1 text-[11px] text-red-400 font-mono">{errorMessage}</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-green-400 py-3 text-xs font-bold text-zinc-950 shadow-[0_0_20px_rgba(16,185,129,0.35)] hover:scale-[1.01] active:scale-95 transition disabled:opacity-50"
                >
                  {status === "loading" ? (
                    <span className="flex items-center gap-2">
                      <span className="h-3 w-3 animate-spin rounded-full border-2 border-zinc-950 border-t-transparent" />
                      Hazırlanıyor...
                    </span>
                  ) : (
                    <>
                      <Download className="h-4 w-4" />
                      <span>Raporu Ücretsiz İndirin (PDF)</span>
                    </>
                  )}
                </button>

                <p className="text-[10px] text-zinc-500 text-center font-mono">
                  🔒 Verileriniz 6698 sayılı KVKK kapsamında korunur.
                </p>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
