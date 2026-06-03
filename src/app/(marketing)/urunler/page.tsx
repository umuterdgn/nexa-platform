import Link from "next/link";
import { connectMongoDB } from "@/lib/mongodb";
import { Product } from "@/models/Product";
import { Navbar } from "@/components/layout/Navbar"; // Yeni dinamik navbarımızı bağlıyoruz

// Sayfanın her zaman en güncel DB verisini çekmesi için force-dynamic yapıyoruz
export const dynamic = "force-dynamic";

export default async function UrunlerPage() {
  let saasProducts = [];
  let serviceProducts = [];
  let isEmpty = true;

  try {
    await connectMongoDB();

    // Turbopack / Mongoose şema tetikleme önlemi
    const _force = Product.modelName;

    // 🔥 ÇÖZÜM 1: Plain JS nesnesi almak için sorguya .lean() ekledik. 
    // Bu sayede _id verileri Next.js mimarisinde asla bozulmaz ve checkout linki tıkır tıkır çalışır.
    const products = await Product.find({}).sort({ createdAt: -1 }).lean();

    // Ürünleri türlerine göre ayıklıyoruz (İstediğin profesyonel kategorizasyon)
    saasProducts = products.filter((p: any) => p.type === "saas");
    serviceProducts = products.filter((p: any) => p.type === "service");
    isEmpty = products.length === 0;

  } catch (error) {
    console.error("Ürünler çekilirken DB hatası oluştu:", error);
  }

  return (
    <div className="min-h-screen bg-black text-foreground selection:bg-blue-500/30">
      {/* Akıllı Giriş/Çıkış Kontrollü Navbar */}
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:py-32">
        {/* Başlık Alanı */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-nexa-electric-bright">
            Nexa Çözümleri
          </p>
          <h1 className="mt-4 font-display text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
            İşinizi büyüten <span className="text-gradient-nexa">Nexa ürünleri</span>
          </h1>
          <p className="mt-6 text-lg text-slate-400">
            SaaS paketleri ve ajans hizmetleri — veritabanından anlık ve dinamik listelenir.
          </p>
        </div>

        {/* Dinamik Ürün Grid Alanı */}
        {isEmpty ? (
          <div className="rounded-2xl border border-dashed border-white/15 bg-slate-900/40 p-12 text-center max-w-md mx-auto">
            <p className="text-slate-400">Henüz vitrinde ürün bulunmuyor.</p>
          </div>
        ) : (
          <div className="space-y-20">
            
            {/* 🌌 SAAS ÜRÜNLERİ BÖLÜMÜ */}
            {saasProducts.length > 0 && (
              <div>
                <h2 className="mb-8 font-display text-2xl font-semibold text-white border-l-2 border-nexa-electric pl-3">
                  SaaS Paketleri
                </h2>
                <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 items-stretch">
                  {saasProducts.map((product: any) => {
                    const productId = product._id.toString();
                    const hasDiscount = product.discountPrice > 0 && product.discountPrice < product.price;

                    return (
                      <div
                        key={productId}
                        className="flex flex-col justify-between rounded-2xl border border-white/10 bg-gradient-to-b from-nexa-anthracite/40 to-black p-6 shadow-2xl transition-all duration-300 hover:border-nexa-electric/40 hover:shadow-nexa-electric/5 group"
                      >
                        <div>
                          <h3 className="font-display text-xl font-semibold text-white group-hover:text-nexa-neon transition-colors">
                            {product.title}
                          </h3>

                          {/* 🔥 ÇÖZÜM 2: Akıllı ve İndirim Duyarlı Fiyat Alanı */}
                          <div className="mt-4 flex items-baseline text-white">
                            {hasDiscount ? (
                              <div className="flex flex-col">
                                <span className="text-xs text-slate-500 line-through font-mono">
                                  ₺{product.price.toLocaleString("tr-TR")}
                                </span>
                                <div className="flex items-baseline gap-0.5">
                                  <span className="text-3xl font-bold tracking-tight text-emerald-400">
                                    ₺{product.discountPrice.toLocaleString("tr-TR")}
                                  </span>
                                  <span className="text-xs text-slate-400">/aylık</span>
                                </div>
                              </div>
                            ) : (
                              <>
                                <span className="text-3xl font-bold tracking-tight">
                                  ₺{product.price.toLocaleString("tr-TR")}
                                </span>
                                <span className="ml-1 text-sm font-semibold text-slate-400">/aylık</span>
                              </>
                            )}
                          </div>

                          <p className="mt-4 text-sm text-slate-400 leading-relaxed line-clamp-3 min-h-[60px]">
                            {product.description}
                          </p>

                          {product.features && product.features.length > 0 && (
                            <ul className="mt-6 space-y-3 border-t border-white/5 pt-6 text-sm text-slate-300">
                              {product.features.map((feature: string, idx: number) => (
                                <li key={idx} className="flex items-center gap-2.5">
                                  <svg className="h-4 w-4 flex-shrink-0 text-nexa-electric-bright" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                  </svg>
                                  <span className="line-clamp-1">{feature}</span>
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>

                        <div className="mt-8">
                          <Link
                            href={`/checkout/${productId}`}
                            className="block w-full rounded-xl bg-nexa-electric px-4 py-3 text-center text-sm font-semibold text-white shadow-neon-sm transition-all hover:bg-nexa-electric-bright active:scale-[0.98]"
                          >
                            Hemen Başla
                          </Link>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 💼 AJANS HİZMETLERİ BÖLÜMÜ */}
            {serviceProducts.length > 0 && (
              <div>
                <h2 className="mb-8 font-display text-2xl font-semibold text-white border-l-2 border-purple-500 pl-3">
                  Ajans Hizmetleri
                </h2>
                <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 items-stretch">
                  {serviceProducts.map((product: any) => {
                    const productId = product._id.toString();
                    const hasDiscount = product.discountPrice > 0 && product.discountPrice < product.price;

                    return (
                      <div
                        key={productId}
                        className="flex flex-col justify-between rounded-2xl border border-white/10 bg-gradient-to-b from-nexa-anthracite/40 to-black p-6 shadow-2xl transition-all duration-300 hover:border-purple-500/40 hover:shadow-purple-500/5 group"
                      >
                        <div>
                          <h3 className="font-display text-xl font-semibold text-white group-hover:text-purple-400 transition-colors">
                            {product.title}
                          </h3>

                          {/* İndirim Duyarlı Fiyat Alanı (Hizmet için) */}
                          <div className="mt-4 flex items-baseline text-white">
                            {hasDiscount ? (
                              <div className="flex flex-col">
                                <span className="text-xs text-slate-500 line-through font-mono">
                                  ₺{product.price.toLocaleString("tr-TR")}
                                </span>
                                <div className="flex items-baseline gap-0.5">
                                  <span className="text-3xl font-bold tracking-tight text-emerald-400">
                                    ₺{product.discountPrice.toLocaleString("tr-TR")}
                                  </span>
                                  <span className="text-xs text-slate-400">/proje</span>
                                </div>
                              </div>
                            ) : (
                              <>
                                <span className="text-3xl font-bold tracking-tight">
                                  ₺{product.price.toLocaleString("tr-TR")}
                                </span>
                                <span className="ml-1 text-sm font-semibold text-slate-400">/proje</span>
                              </>
                            )}
                          </div>

                          <p className="mt-4 text-sm text-slate-400 leading-relaxed line-clamp-3 min-h-[60px]">
                            {product.description}
                          </p>

                          {product.features && product.features.length > 0 && (
                            <ul className="mt-6 space-y-3 border-t border-white/5 pt-6 text-sm text-slate-300">
                              {product.features.map((feature: string, idx: number) => (
                                <li key={idx} className="flex items-center gap-2.5">
                                  <svg className="h-4 w-4 flex-shrink-0 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                  </svg>
                                  <span className="line-clamp-1">{feature}</span>
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>

                        <div className="mt-8">
                          <Link
                            href={`/checkout/${productId}`}
                            className="block w-full rounded-xl bg-purple-600 px-4 py-3 text-center text-sm font-semibold text-white shadow-md transition-all hover:bg-purple-500 active:scale-[0.98]"
                          >
                            Hemen Başla
                          </Link>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

          </div>
        )}

        <p className="mt-24 text-center text-sm text-slate-500">
          Fiyatlar KDV hariç gösterilir. Ödeme adımında KDV eklenir.
        </p>
      </main>
    </div>
  );
}