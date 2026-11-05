import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { UserMenu } from "@/components/dashboard/UserMenu";
import { PaymentActivationBanner } from "@/components/dashboard/PaymentActivationBanner";
import { getCustomerSubscriptions } from "@/lib/services/customer-service";
import { CustomerDashboardClient } from "@/components/dashboard/CustomerDashboardClient";
import { ShieldCheck, UserCheck, Layers, ArrowLeft, AlertCircle, ArrowRight } from "lucide-react";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function ProfilPage({
  searchParams,
}: {
  searchParams: Promise<{ odeme?: string; error?: string }>;
}) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || !session?.user?.email) {
    redirect("/auth/login?callbackUrl=/profil");
  }

  const { odeme, error } = await searchParams;

  // Müşterinin aktif lisanslarını, fatura durumlarını ve SSO haklarını çek
  const subscriptions = await getCustomerSubscriptions(session.user.id, session.user.email);

  let isVerified = true;
  try {
    const pUser = await (prisma as any).user?.findUnique({
      where: { email: session.user.email.toLowerCase().trim() },
    });
    if (pUser && pUser.isVerified === false) {
      isVerified = false;
    }
  } catch (e) {
    // Devam et
  }

  const displayName = session.user.name || session.user.email.split("@")[0];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Koyu Mavi & Elektrik Mavisi Arka Plan Atmosfer Glow Efektleri */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[450px] overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-[-25%] left-[25%] w-[600px] h-[600px] bg-cyan-600/10 rounded-full blur-[140px]" />
        <div className="absolute top-[-15%] right-[25%] w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[160px]" />
      </div>

      {/* ÜST DASHBOARD NAVİGASYONU */}
      <header className="sticky top-0 z-40 border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2 group">
              <span className="text-xl font-black tracking-tight text-white group-hover:text-cyan-300 transition">
                NEXA<span className="text-cyan-400">.</span>
              </span>
              <span className="hidden sm:inline-block text-[11px] font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                Müşteri Portalı
              </span>
            </Link>

            <nav className="hidden md:flex items-center gap-4 text-xs font-mono text-slate-400">
              <Link href="/" className="hover:text-cyan-300 transition flex items-center gap-1">
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Ana Sayfa</span>
              </Link>
              <span>/</span>
              <span className="text-cyan-400 font-semibold">Dashboard</span>
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono text-slate-300">
              <UserCheck className="w-3.5 h-3.5 text-cyan-400" />
              <span>{session.user.email}</span>
            </div>
            <UserMenu role={session.user.role} />
          </div>
        </div>
      </header>

      {/* ANA İÇERİK ALANI */}
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        {odeme === "basarili" && <PaymentActivationBanner />}

        {error && (
          <div className="mb-8 p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm font-mono flex items-center gap-2">
            <span>Ulaşmaya çalıştığınız yönetim paneli yetkisi doğrulanamadı. Lütfen tekrar deneyiniz.</span>
          </div>
        )}

        {!isVerified && (
          <div className="mb-8 rounded-2xl border border-amber-500/40 bg-amber-950/30 p-4 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-amber-300">
            <div className="flex items-center gap-2.5">
              <AlertCircle className="h-5 w-5 text-amber-400 shrink-0" />
              <span>E-posta adresiniz henüz doğrulanmamış. Güvenliğiniz için lütfen 6 haneli kodunuzu onaylayın.</span>
            </div>
            <Link
              href={`/auth/verify?email=${encodeURIComponent(session.user.email)}`}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs hover:bg-amber-400 transition shrink-0"
            >
              <span>Şimdi Doğrula</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        )}

        {/* HOŞ GELDİNİZ BAŞLIĞI */}
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-mono font-semibold uppercase tracking-wider text-cyan-400 mb-2">
              <ShieldCheck className="w-4 h-4 text-cyan-400" />
              <span>Nexa B2B Cloud Gateway &bull; Müşteri Yönetim Merkezi</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
              Hoş Geldiniz, {displayName}
            </h1>
            <p className="mt-2 text-sm sm:text-base text-slate-400 max-w-2xl">
              Satın aldığınız SaaS ürünlerini, lisans sürelerinizi, faturalarınızı yönetebilir ve
              tek tıkla tek oturum açma (SSO) ile yönetim panellerinize geçiş yapabilirsiniz.
            </p>
          </div>
        </div>

        {/* İNTERAKTİF MÜŞTERİ DASHBOARD İSTEMCİ BİLEŞENİ */}
        <CustomerDashboardClient
          initialSubscriptions={subscriptions}
          userName={displayName}
          userEmail={session.user.email}
        />
      </main>
    </div>
  );
}
