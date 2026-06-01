import Link from "next/link";
import { connectMongoDB } from "@/lib/mongodb";
import { Product } from "@/models/Product";

// Sayfanın her zaman en güncel DB verisini çekmesi için önbelleği kapatıyoruz
export const revalidate = 0;

export default async function UrunlerPage() {
  let products = [];

  try {
    // 1. Veritabanına bağlan
    await connectMongoDB();

    // 2. Eklediğin tüm ürünleri MongoDB'den çek
    products = await Product.find({}).sort({ createdAt: -1 });
  } catch (error) {
    console.error("Ürünler çekilirken DB hatası oluştu:", error);
  }

  return (
    <div className="min-h-screen bg-black text-foreground selection:bg-blue-500/30">
      {/* Üst Menü / Navbar */}
      {/* Başlık Alanı */}
      <main className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-24">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <p className="text-sm font-semibold uppercase tracking-widest text-blue-500">
            Nexa Çözümleri
          </p>
          <h1 className="mt-3 font-display text-4xl font-bold tracking-tight text-white sm:text-5xl">
            SaaS ve Dijital Hizmet Vitrini
          </h1>
          <p className="mt-4 text-base text-slate-400 leading-relaxed">
            İşletmenizi dijital çağda öne geçirecek yeni nesil yazılım ve
            otomasyon çözümlerimizle hemen tanışın.
          </p>
        </div>

        {/* Dinamik Ürün Grid Alanı */}
        {products.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-white/15 bg-slate-900/40 p-12 text-center max-w-md mx-auto">
            <p className="text-slate-400">Henüz vitrinde ürün bulunmuyor.</p>
            <Link
              href="/admin/urun-ekle"
              className="mt-4 inline-block text-sm font-medium text-blue-500 hover:underline"
            >
              Yönetici olarak ilk ürünü ekleyin →
            </Link>
          </div>
        ) : (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 items-stretch">
            {products.map((product: any) => (
              <div
                key={product._id.toString()}
                className="flex flex-col justify-between rounded-2xl border border-white/10 bg-gradient-to-b from-slate-900/60 to-slate-950 p-6 shadow-2xl transition-all duration-300 hover:border-blue-500/40 hover:shadow-blue-500/5 group"
              >
                <div>
                  {/* Ürün Başlığı */}
                  <h3 className="font-display text-xl font-semibold text-white group-hover:text-blue-400 transition-colors">
                    {product.title || product.name}
                  </h3>

                  {/* Fiyat Alanı */}
                  <div className="mt-4 flex items-baseline text-white">
                    <span className="text-3xl font-bold tracking-tight">
                      {product.price}
                    </span>
                    <span className="ml-1 text-sm font-semibold text-slate-400">
                      /aylık
                    </span>
                  </div>

                  {/* Açıklama */}
                  <p className="mt-4 text-sm text-slate-400 leading-relaxed line-clamp-3">
                    {product.description}
                  </p>

                  {/* Özellikler Listesi (Eğer şemada dizge olarak varsa) */}
                  {product.features && product.features.length > 0 && (
                    <ul className="mt-6 space-y-3 border-t border-white/5 pt-6 text-sm text-slate-300">
                      {product.features.map((feature: string, idx: number) => (
                        <li key={idx} className="flex items-center gap-2.5">
                          <svg
                            className="h-4 w-4 flex-shrink-0 text-blue-500"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth="3"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                          <span className="line-clamp-1">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                {/* Satın Alma Butonu */}
                <div className="mt-8">
                  <Link
                    href={`/checkout/${product._id.toString()}`}
                    className="block w-full rounded-xl bg-blue-600 px-4 py-3 text-center text-sm font-semibold text-white shadow-md transition-all hover:bg-blue-500 active:scale-[0.98]"
                  >
                    Hemen Başla
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
