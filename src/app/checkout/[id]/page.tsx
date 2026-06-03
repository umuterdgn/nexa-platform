import { connectMongoDB } from "@/lib/mongodb";
import { Product } from "@/models/Product";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export default async function CheckoutPage({
  params,
}: {
  params: Promise<{ id: string }>; // Next.js yeni standardı: params artık bir Promise
}) {
  // 1. Params'ı güvenli bir şekilde çözümlüyoruz (Hatanın asıl çözümü bu satır)
  const resolvedParams = await params;
  const productId = resolvedParams.id;

  // 2. Kullanıcı giriş yapmamışsa login sayfasına at
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    redirect("/auth/login?callbackUrl=/urunler");
  }

  // 3. Veritabanına bağlanıp ürünü arıyoruz
  await connectMongoDB();
  const _force = Product.modelName; // Turbopack şema kilidini açar

  let product = null;
  try {
    product = await Product.findById(productId).lean();
  } catch (error) {
    console.error("ID formatı geçersiz:", error);
  }

  // Ürün gerçekten veritabanında yoksa veya ID hatalıysa
  if (!product) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white">
        <h1 className="text-3xl font-display font-bold text-red-500 mb-4">
          Ürün Bulunamadı
        </h1>
        <p className="text-slate-400">
          Aradığınız ürün yayından kaldırılmış veya URL hatalı olabilir.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-8 lg:p-24 flex justify-center items-center">
      <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* SOL: Özet Kartı */}
        <div className="bg-nexa-anthracite/40 border border-white/10 p-8 rounded-2xl h-fit">
          <h2 className="text-sm font-semibold text-nexa-electric-bright uppercase tracking-widest mb-6">
            Sipariş Özeti
          </h2>
          <div className="mb-4">
            <h3 className="text-2xl font-display font-bold">{product.title}</h3>
            <p className="text-slate-400 mt-2 text-sm">{product.description}</p>
          </div>

          <div className="border-t border-white/10 pt-4 mt-6 flex justify-between items-end">
            <span className="text-slate-400">Toplam Tutar:</span>
            <span className="text-3xl font-bold text-emerald-400">
              ₺
              {product.discountPrice > 0
                ? product.discountPrice
                : product.price}
            </span>
          </div>
        </div>

        {/* SAĞ: Test Ödeme Formu */}
        <div className="bg-nexa-anthracite/80 border border-nexa-electric/30 p-8 rounded-2xl shadow-[0_0_30px_rgba(59,130,246,0.1)]">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            💳 Güvenli Ödeme (Test)
          </h2>

          <form
            className="space-y-4"
            action="/api/simulate-payment"
            method="POST"
          >
            {/* Arka planda API'ye ürün ID'sini gönderiyoruz */}
            <input type="hidden" name="productId" value={productId} />

            <div>
              <label className="text-xs text-slate-400 block mb-1">
                Kart Numarası
              </label>
              <input
                type="text"
                placeholder="0000 0000 0000 0000"
                className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-white focus:border-nexa-electric outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-slate-400 block mb-1">
                  Son Kullanma (AA/YY)
                </label>
                <input
                  type="text"
                  placeholder="12/28"
                  className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-white focus:border-nexa-electric outline-none"
                />
              </div>
              <div>
                <label className="text-xs text-slate-400 block mb-1">CVV</label>
                <input
                  type="text"
                  placeholder="123"
                  className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-white focus:border-nexa-electric outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full mt-6 bg-nexa-electric hover:bg-nexa-electric-bright text-white font-bold py-3.5 rounded-xl transition-all shadow-neon-sm active:scale-95"
            >
              Test Ödemesini Tamamla
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
