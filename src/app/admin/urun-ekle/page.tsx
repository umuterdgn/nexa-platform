import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { authOptions } from "@/lib/auth";
import { ProductForm } from "@/components/admin/ProductForm";
import { ArrowLeft, PlusCircle, Sparkles, Database } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Yeni Ürün & SSO Paketi Ekle | Nexa Admin",
  robots: { index: false, follow: false },
};

export default async function AdminUrunEklePage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/auth/login?callbackUrl=/admin/urun-ekle");
  }

  if (session.user.role !== "admin") {
    redirect("/profil");
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 sm:p-10">
      <div className="mx-auto max-w-4xl">
        {/* Üst Navigasyon */}
        <div className="flex items-center justify-between gap-4 border-b border-slate-800 pb-6 mb-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono font-semibold uppercase tracking-wider text-cyan-400 mb-2">
              <Database className="w-4 h-4 text-cyan-400" />
              <span>Prisma & SSO Model Kataloğu</span>
            </div>
            <h1 className="text-3xl font-black text-white tracking-tight">
              Dinamik SaaS ve Hizmet Paketi Ekle
            </h1>
            <p className="mt-1.5 text-sm text-slate-400">
              Form doğrudan Prisma veritabanına yazar; URL Slugu ve Yönetim Paneli SSO URL&apos;ini anında vitrine bağlar.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/admin/urunler"
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-mono text-slate-300 transition"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Ürün Listesine Dön</span>
            </Link>
            <Link
              href="/admin"
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-mono text-slate-300 transition"
            >
              <span>HQ Paneli</span>
            </Link>
          </div>
        </div>

        {/* Form Kartı */}
        <div className="rounded-3xl border border-slate-800/80 bg-slate-900/60 p-6 sm:p-10 backdrop-blur-xl shadow-2xl shadow-cyan-500/5">
          <ProductForm />
        </div>
      </div>
    </div>
  );
}
