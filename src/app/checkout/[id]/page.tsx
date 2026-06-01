import { getServerSession } from "next-auth";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { Shield, Check } from "lucide-react";
import { authOptions } from "@/lib/auth";
import { getProductById } from "@/lib/products-mock";

interface CheckoutPageProps {
  params: Promise<{ id: string }>;
}

export default async function CheckoutPage({ params }: CheckoutPageProps) {
  const { id } = await params;
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect(`/auth/login?callbackUrl=/checkout/${id}`);
  }

  const product = getProductById(id);
  if (!product) notFound();

  const kdv = Math.round(product.price * 0.2);
  const total = product.price + kdv;

  return (
    <div className="min-h-screen bg-black">
      <header className="border-b border-white/10">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Link href="/urunler" className="text-sm text-slate-400 transition hover:text-white">
            ← Ürünlere dön
          </Link>
          <Link href="/" className="font-display text-lg font-semibold">
            <span className="text-gradient-nexa">Nexa</span>
          </Link>
        </div>
      </header>

      <main className="mx-auto grid max-w-6xl gap-8 px-4 py-10 lg:grid-cols-2 lg:gap-12 lg:py-16 sm:px-6">
        {/* Sipariş özeti */}
        <section className="rounded-2xl border border-white/10 bg-[#0F172A]/60 p-8">
          <h1 className="font-display text-2xl font-semibold text-white">
            Sipariş Özeti
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            {session.user.email}
          </p>

          <div className="mt-8 rounded-xl border border-white/5 bg-black/40 p-6">
            <h2 className="font-semibold text-white">{product.title}</h2>
            <p className="mt-2 text-sm text-slate-400">{product.description}</p>
            <ul className="mt-4 space-y-2">
              {product.features.slice(0, 3).map((f) => (
                <li key={f} className="flex items-center gap-2 text-sm text-slate-300">
                  <Check className="h-3.5 w-3.5 text-[#3B82F6]" />
                  {f}
                </li>
              ))}
            </ul>
          </div>

          <dl className="mt-8 space-y-3 border-t border-white/10 pt-6 text-sm">
            <div className="flex justify-between text-slate-400">
              <dt>Ara toplam</dt>
              <dd className="text-white">₺{product.price}</dd>
            </div>
            <div className="flex justify-between text-slate-400">
              <dt>KDV (%20)</dt>
              <dd className="text-white">₺{kdv}</dd>
            </div>
            <div className="flex justify-between border-t border-white/10 pt-3 text-base font-semibold">
              <dt className="text-white">Toplam</dt>
              <dd className="text-[#3B82F6]">₺{total} / {product.period}</dd>
            </div>
          </dl>
        </section>

        {/* Güvenli ödeme alanı */}
        <section className="flex flex-col rounded-2xl border border-[#1D4ED8]/20 bg-[#0F172A]/80 p-8 shadow-[0_0_40px_rgba(29,78,216,0.08)]">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#1D4ED8]/20">
              <Shield className="h-5 w-5 text-[#3B82F6]" />
            </div>
            <div>
              <h2 className="font-display text-xl font-semibold text-white">
                Güvenli Ödeme Alanı
              </h2>
              <p className="text-xs text-slate-400">256-bit SSL · PayTR altyapısı</p>
            </div>
          </div>

          <div className="flex flex-1 flex-col items-center justify-center rounded-xl border border-dashed border-white/15 bg-black/50 px-6 py-16 text-center">
            <p className="text-sm font-medium text-slate-300">
              PayTR ödeme formu buraya yerleştirilecek
            </p>
            <p className="mt-2 max-w-xs text-xs text-slate-500">
              iFrame entegrasyonu sonraki adımda eklenecek. Şimdilik ödeme alanı hazır.
            </p>
            <div className="mt-8 h-48 w-full max-w-sm rounded-lg bg-white/5" />
          </div>

          <p className="mt-6 text-center text-xs text-slate-500">
            Ödeme bilgileriniz Nexa tarafından saklanmaz; işlem PayTR güvencesiyle gerçekleşir.
          </p>
        </section>
      </main>
    </div>
  );
}
