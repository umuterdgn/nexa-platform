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
  const verified = searchParams.get("verified");
  const verifyError = searchParams.get("error");

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
      if (res.error === "EMAIL_NOT_VERIFIED") {
        setError(
          "E-posta adresiniz henüz doğrulanmamış. Lütfen gelen kutunuzu kontrol edin.",
        );
        return;
      }
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
        {verified === "1" && (
          <p className="rounded-lg bg-emerald-500/10 px-3 py-2 text-sm text-emerald-400">
            E-posta adresiniz doğrulandı. Giriş yapabilirsiniz.
          </p>
        )}
        {verifyError === "invalid_token" && (
          <p className="rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-400">
            Doğrulama bağlantısı geçersiz veya süresi dolmuş.
          </p>
        )}
        {verifyError === "verification_failed" && (
          <p className="rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-400">
            Doğrulama sırasında bir hata oluştu. Lütfen tekrar deneyin.
          </p>
        )}
        {searchParams.get("reset") === "1" && (
          <p className="rounded-lg bg-emerald-500/10 px-3 py-2 text-sm text-emerald-400">
            Şifreniz güncellendi. Giriş yapabilirsiniz.
          </p>
        )}
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
        <div className="text-right">
          <Link
            href="/auth/forgot-password"
            className="text-xs text-[#3B82F6] hover:underline"
          >
            Şifremi unuttum
          </Link>
        </div>
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
