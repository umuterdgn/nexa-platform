import { connectMongoDB } from "@/lib/mongodb";
import User from "@/models/User";
import { Product } from "@/models/Product";
import { Users, Package, TrendingUp, Sparkles, HelpCircle } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminOverview() {
  await connectMongoDB();

  // Şema tetikleme güvenlik önlemi
  const _force = Product.modelName;

  // Tüm kritik verileri paralel olarak DB'den çekiyoruz
  const [users, products] = await Promise.all([
    User.find({}).lean(),
    Product.find({}).sort({ salesCount: -1 }).limit(3).lean(), // En çok satan ilk 3 ürünü çek
  ]);

  const customers = users.filter((u) => u.role !== "admin");

  // Aktif abonelik analitiği
  let totalActiveSubs = 0;
  users.forEach((u: any) => {
    if (u.subscriptions) {
      totalActiveSubs += u.subscriptions.filter(
        (s: any) => s.status === "active",
      ).length;
    }
  });

  return (
    <div className="p-8 lg:p-12">
      {/* Karşılama Başlığı */}
      <div className="mb-10">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-nexa-neon">
          <Sparkles size={12} /> Canlı Sistem Durumu
        </div>
        <h1 className="mt-2 font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
          Kontrol Paneli
        </h1>
        <p className="mt-2 text-slate-400 text-sm">
          Nexa ekosistemindeki SaaS lisanslarını, ajans hizmetlerini ve finansal
          verileri anlık analiz edin.
        </p>
      </div>

      {/* Üst Büyük İstatistik Kartları */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-2xl border border-white/5 bg-nexa-anthracite/10 p-6 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-slate-400">
              Toplam Portföy (Müşteri)
            </span>
            <Users className="text-nexa-electric-bright" size={20} />
          </div>
          <p className="mt-4 font-display text-4xl font-semibold tracking-tight">
            {customers.length}
          </p>
          <span className="mt-2 block text-xs text-slate-500">
            Sisteme kayıtlı aktif hesaplar
          </span>
        </div>

        <div className="rounded-2xl border border-white/5 bg-nexa-anthracite/10 p-6 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-slate-400">
              Aktif SaaS Lisansı
            </span>
            <Package className="text-nexa-neon" size={20} />
          </div>
          <p className="mt-4 font-display text-4xl font-semibold tracking-tight">
            {totalActiveSubs}
          </p>
          <span className="mt-2 block text-xs text-slate-500">
            Bulut sistemleri kullanan işletmeler
          </span>
        </div>

        <div className="rounded-2xl border border-white/5 bg-nexa-anthracite/10 p-6 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-slate-400">
              Brüt Proje Cirosu
            </span>
            <TrendingUp className="text-emerald-400" size={20} />
          </div>
          <p className="mt-4 font-display text-4xl font-semibold tracking-tight text-emerald-400">
            ₺{(totalActiveSubs * 2450).toLocaleString("tr-TR")}
          </p>
          <span className="mt-2 block text-xs text-slate-500">
            Simüle edilen anlık hakediş
          </span>
        </div>
      </div>

      {/* Alt Bölüm: En Çok Tercih Edilen Ürünler (salesCount) */}
      <div className="mt-12 max-w-4xl">
        <div className="rounded-2xl border border-white/5 bg-nexa-anthracite/5 p-6">
          <h2 className="font-display text-lg font-semibold mb-2 flex items-center gap-2">
            🔥 En Çok Tercih Edilen Çözümler
          </h2>
          <p className="text-xs text-slate-500 mb-6">
            Satış adetlerine göre vitrindeki en popüler Nexa paketleri.
          </p>

          {products.length === 0 ? (
            <p className="text-sm text-slate-500 py-4">
              Henüz analiz edilecek ürün verisi yok.
            </p>
          ) : (
            <div className="space-y-4">
              {products.map((product: any, idx: number) => (
                <div
                  key={product._id.toString()}
                  className="flex items-center justify-between p-4 rounded-xl border border-white/[0.02] bg-white/[0.01] hover:bg-white/[0.03] transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <span className="font-mono text-sm font-bold text-slate-600">
                      0{idx + 1}
                    </span>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-white">
                        {product.title}
                      </span>
                      <span className="text-xs text-slate-500 capitalize font-mono">
                        {product.type} Planı
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-8">
                    <div className="text-right">
                      <span className="text-xs text-slate-500 block">
                        Fiyat
                      </span>
                      <span className="text-sm font-semibold text-slate-300">
                        ₺{product.price}
                      </span>
                    </div>
                    <div className="text-right bg-nexa-electric/10 px-3 py-1 rounded-lg border border-nexa-electric/20">
                      <span className="text-xs text-nexa-electric-bright font-bold">
                        {product.salesCount || 0} Tercih
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
