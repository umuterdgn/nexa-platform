"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AuthShell, AuthInput, AuthButton } from "./AuthShell";

export function RegisterForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error ?? "Kayıt başarısız.");
      setLoading(false);
      return;
    }

    const login = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setLoading(false);

    if (login?.error) {
      router.push("/auth/login");
      return;
    }

    router.push("/profil");
    router.refresh();
  }

  return (
    <AuthShell
      title="Kayıt Ol"
      subtitle="Nexa ekosistemine katılın."
      footer={
        <>
          Zaten hesabınız var mı?{" "}
          <Link href="/auth/login" className="text-[#3B82F6] hover:underline">
            Giriş yapın
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <AuthInput
          label="Ad Soyad"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Adınız Soyadınız"
          required
          autoComplete="name"
        />
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
          placeholder="En az 8 karakter"
          required
          minLength={8}
          autoComplete="new-password"
        />
        {error && (
          <p className="rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-400">
            {error}
          </p>
        )}
        <AuthButton loading={loading}>Hesap Oluştur</AuthButton>
      </form>
    </AuthShell>
  );
}
