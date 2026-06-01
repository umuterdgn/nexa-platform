import Link from "next/link";

export default function CheckoutNotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-black px-4 text-center">
      <h1 className="font-display text-2xl font-semibold text-white">
        Ürün bulunamadı
      </h1>
      <p className="mt-2 text-slate-400">Geçersiz veya kaldırılmış bir plan seçtiniz.</p>
      <Link
        href="/urunler"
        className="mt-6 rounded-xl bg-[#1D4ED8] px-6 py-2.5 text-sm font-semibold text-white"
      >
        Ürünlere Dön
      </Link>
    </div>
  );
}
