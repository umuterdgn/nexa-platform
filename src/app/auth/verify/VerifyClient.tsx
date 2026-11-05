"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck, Mail, CheckCircle2, AlertCircle, RefreshCw, ArrowRight } from "lucide-react";
import Link from "next/link";

interface Props {
  initialEmail?: string;
  initialError?: string;
}

export function VerifyClient({ initialEmail = "", initialError }: Props) {
  const router = useRouter();
  const [email, setEmail] = useState(initialEmail);
  const [code, setCode] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(
    initialError === "invalid_token"
      ? "Doğrulama bağlantısı geçersiz veya süresi dolmuş."
      : initialError === "unverified"
      ? "Lütfen devam etmeden önce e-posta adresinizi doğrulayın."
      : null
  );
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !code) {
      setErrorMsg("Lütfen e-posta adresinizi ve 6 haneli kodu eksiksiz girin.");
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      const res = await fetch("/api/auth/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Doğrulama kodu hatalı.");
      }

      setIsSuccess(true);
      setTimeout(() => {
        router.push("/profil?verified=1");
      }, 2000);
    } catch (err: any) {
      setErrorMsg(err.message || "Bir hata oluştu.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="text-center py-6">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-emerald-500/40 bg-emerald-500/10 text-emerald-400 mb-4">
          <CheckCircle2 className="h-8 w-8" />
        </div>
        <h3 className="text-2xl font-bold text-white">E-Postanız Doğrulandı!</h3>
        <p className="mt-2 text-xs text-slate-300">
          Hesabınız başarıyla aktifleştirildi. Müşteri konsolunuza yönlendiriliyorsunuz...
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="block text-xs font-mono text-slate-400 mb-1">
          Kayıtlı E-Posta Adresiniz
        </label>
        <div className="relative">
          <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
          <input
            type="email"
            required
            placeholder="yonetici@sirketiniz.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-xl border border-slate-800 bg-slate-900/80 pl-10 pr-3.5 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-mono text-slate-400 mb-1">
          6 Haneli Doğrulama Kodu (OTP)
        </label>
        <input
          type="text"
          required
          maxLength={6}
          placeholder="Örn: 489201"
          value={code}
          onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
          className="w-full text-center tracking-[8px] font-mono font-bold text-xl rounded-xl border border-slate-800 bg-slate-900/80 py-3 text-cyan-300 placeholder-slate-600 focus:outline-none focus:border-cyan-500"
        />
        <p className="mt-1.5 text-center text-[11px] text-slate-500 font-mono">
          E-postanıza gelen kutunuzdan veya spam klasöründen bakın. (Test için: 123456)
        </p>
      </div>

      {errorMsg && (
        <div className="flex items-center gap-2 rounded-xl border border-red-500/30 bg-red-950/30 p-3 text-xs text-red-400">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <button
        type="submit"
        disabled={isSubmitting || code.length < 6}
        className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-cyan-500 py-3 text-xs sm:text-sm font-bold text-white shadow-lg shadow-cyan-500/25 transition-all hover:scale-[1.01] active:scale-95 disabled:opacity-50 cursor-pointer"
      >
        {isSubmitting ? (
          <>
            <RefreshCw className="h-4 w-4 animate-spin" />
            <span>Doğrulanıyor...</span>
          </>
        ) : (
          <>
            <span>Hesabımı Doğrula ve Devam Et</span>
            <ArrowRight className="h-4 w-4" />
          </>
        )}
      </button>

      <div className="pt-4 border-t border-slate-800/80 text-center text-xs text-slate-400 flex items-center justify-between">
        <Link href="/auth/login" className="hover:text-cyan-300 transition">
          &larr; Giriş Ekranına Dön
        </Link>
        <Link href="/profil" className="hover:text-cyan-300 transition">
          Müşteri Portalı
        </Link>
      </div>
    </form>
  );
}

