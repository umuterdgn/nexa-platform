import React from "react";
import type { Metadata } from "next";
import { ShieldCheck, Sparkles } from "lucide-react";
import { VerifyClient } from "./VerifyClient";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "E-Posta Doğrulama & Güvenlik Onayı | Nexa Platform",
  description: "Nexa B2B Cloud hesabınızı aktifleştirmek için 6 haneli doğrulama kodunu girin.",
};

interface Props {
  searchParams: Promise<{
    email?: string;
    error?: string;
  }>;
}

export default async function VerifyPage({ searchParams }: Props) {
  const { email, error } = await searchParams;

  return (
    <div className="relative min-h-screen bg-slate-950 text-slate-100 selection:bg-cyan-500/30 selection:text-cyan-200 flex items-center justify-center pt-28 pb-20 px-4 sm:px-6 lg:px-8">
      {/* Background Ambient Glow */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[700px] rounded-full bg-cyan-600/10 blur-[140px]" />
      </div>

      <div className="relative w-full max-w-md">
        <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 sm:p-8 backdrop-blur-xl shadow-2xl">
          <div className="text-center mb-6">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl border border-cyan-500/30 bg-cyan-500/10 text-cyan-400 mb-3">
              <ShieldCheck className="h-6 w-6" />
            </div>

            <h1 className="text-xl sm:text-2xl font-bold text-white">
              E-Posta Doğrulama & Güvenlik
            </h1>
            <p className="mt-1.5 text-xs text-slate-300">
              PayTR ödeme adımına ve kurumsal SSO panellerinize erişebilmek için lütfen 6 haneli kodunuzu girin.
            </p>
          </div>

          <VerifyClient initialEmail={email || ""} initialError={error} />
        </div>
      </div>
    </div>
  );
}

