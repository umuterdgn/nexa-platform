"use client";

import { useState } from "react";
import Link from "next/link";
import { AuthShell, AuthInput, AuthButton } from "./AuthShell";

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    const res = await fetch("/api/auth/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error ?? "İşlem başarısız.");
      return;
    }

    setSuccess(data.message);
  }

  return (
    <AuthShell
      title="Şifremi Unuttum"
      subtitle="E-posta adresinize şifre sıfırlama bağlantısı göndereceğiz."
      footer={
        <>
          <Link href="/auth/login" className="text-[#3B82F6] hover:underline">
            Giriş sayfasına dön
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <AuthInput
          label="E-posta"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="ornek@sirket.com"
          required
          autoComplete="email"
        />
        {error && (
          <p className="rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-400">
            {error}
          </p>
        )}
        {success && (
          <p className="rounded-lg bg-emerald-500/10 px-3 py-2 text-sm text-emerald-400">
            {success}
          </p>
        )}
        <AuthButton loading={loading}>Sıfırlama Bağlantısı Gönder</AuthButton>
      </form>
    </AuthShell>
  );
}
