import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { authOptions } from "@/lib/auth";
import { ActiveProductCard } from "@/components/dashboard/ActiveProductCard";

const MOCK_PRODUCTS = [
  {
    name: "Nexa Randevu Sistemi",
    daysRemaining: 245,
    totalDays: 365,
    panelUrl: "#",
    icon: "calendar" as const,
  },
  {
    name: "Nexa Kasa Takip",
    daysRemaining: 18,
    totalDays: 30,
    panelUrl: "#",
    icon: "wallet" as const,
  },
];

export default async function ProfilPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/auth/login?callbackUrl=/profil");
  }

  return (
    <div className="min-h-screen bg-black">
      <header className="border-b border-white/10 bg-black/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Link href="/" className="font-display text-xl font-semibold">
            <span className="text-gradient-nexa">Nexa</span>
          </Link>
          <span className="text-sm text-slate-400">
            {session.user.name ?? session.user.email}
          </span>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
        <div className="mb-10">
          <p className="text-sm font-medium uppercase tracking-widest text-[#3B82F6]">
            Müşteri Paneli
          </p>
          <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            Hoş geldiniz, {session.user.name?.split(" ")[0] ?? "Müşteri"}
          </h1>
          <p className="mt-2 text-slate-400">
            Aktif SaaS ürünlerinizi buradan yönetebilirsiniz.
          </p>
        </div>

        <section>
          <h2 className="mb-6 text-lg font-semibold text-white">
            Aktif Ürünlerim
          </h2>
          <div className="grid gap-5 sm:grid-cols-2">
            {MOCK_PRODUCTS.map((product) => (
              <ActiveProductCard key={product.name} {...product} />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
