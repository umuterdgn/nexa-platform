import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { authOptions } from "@/lib/auth";
import { ProductForm } from "@/components/admin/ProductForm";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Ürün Ekle",
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
    <div className="min-h-screen bg-black">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(29,78,216,0.12),transparent_55%)]" />
      <div className="relative mx-auto max-w-lg px-4 py-16 sm:py-24">
        <Link href="/" className="font-display text-xl font-semibold">
          <span className="text-gradient-nexa">Nexa</span>
          <span className="ml-2 text-xs font-normal text-slate-500">Admin</span>
        </Link>

        <h1 className="mt-8 font-display text-2xl font-semibold text-white">
          Ürün Ekle
        </h1>
        <p className="mt-2 text-sm text-slate-400">
          Yeni SaaS veya hizmet paketini vitrine ekleyin.
        </p>

        <div className="mt-8 rounded-2xl border border-white/10 bg-[#0F172A]/80 p-8 backdrop-blur-xl">
          <ProductForm />
        </div>

        <p className="mt-6 text-center text-xs text-slate-600">
          Bu sayfa yalnızca admin kullanıcılar içindir.
        </p>
      </div>
    </div>
  );
}
