"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { AuthShell, AuthInput, AuthButton } from "./AuthShell";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/profil";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setLoading(false);

    if (res?.error) {
      setError("E-posta veya şifre hatalı.");
      return;
    }

    router.push(callbackUrl);
    router.refresh();
  }

  return (
    <AuthShell
      title="Giriş Yap"
      subtitle="Nexa müşteri panelinize erişin."
      footer={
        <>
          Hesabınız yok mu?{" "}
          <Link href="/auth/register" className="text-[#3B82F6] hover:underline">
            Kayıt olun
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
        <AuthInput
          label="Şifre"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          required
          autoComplete="current-password"
        />
        {error && (
          <p className="rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-400">
            {error}
          </p>
        )}
        <AuthButton loading={loading}>Panele Giriş</AuthButton>
      </form>
    </AuthShell>
  );
}
