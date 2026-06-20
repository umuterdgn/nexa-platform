"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { AuthShell, AuthInput, AuthButton } from "./AuthShell";

export function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!token) {
      setError("Geçersiz sıfırlama bağlantısı.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Şifreler eşleşmiyor.");
      return;
    }

    setLoading(true);

    const res = await fetch("/api/auth/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, password }),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error ?? "Şifre güncellenemedi.");
      return;
    }

    router.push("/auth/login?reset=1");
  }

  if (!token) {
    return (
      <AuthShell
        title="Şifre Sıfırla"
        subtitle="Geçersiz veya eksik sıfırlama bağlantısı."
        footer={
          <Link href="/auth/forgot-password" className="text-[#3B82F6] hover:underline">
            Yeni bağlantı iste
          </Link>
        }
      >
        <p className="rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-400">
          Bu sayfaya yalnızca e-postanızdaki sıfırlama bağlantısı ile
          erişebilirsiniz.
        </p>
      </AuthShell>
    );
  }

  return (
    <AuthShell
      title="Yeni Şifre Belirle"
      subtitle="Hesabınız için yeni bir şifre oluşturun."
      footer={
        <Link href="/auth/login" className="text-[#3B82F6] hover:underline">
          Giriş sayfasına dön
        </Link>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <AuthInput
          label="Yeni Şifre"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="En az 8 karakter"
          required
          minLength={8}
          autoComplete="new-password"
        />
        <AuthInput
          label="Şifre Tekrar"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Şifrenizi tekrar girin"
          required
          minLength={8}
          autoComplete="new-password"
        />
        {error && (
          <p className="rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-400">
            {error}
          </p>
        )}
        <AuthButton loading={loading}>Şifreyi Güncelle</AuthButton>
      </form>
    </AuthShell>
  );
}
