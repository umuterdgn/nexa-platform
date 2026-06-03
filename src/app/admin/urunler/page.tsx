import { connectMongoDB } from "@/lib/mongodb";
import { Product } from "@/models/Product";
import { ProductListClient } from "./ProductListClient";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  await connectMongoDB();
  
  // Şema tetikleme güvenlik önlemi
  const _force = Product.modelName;

  // Tüm ürünleri en yeni eklenenden başlayarak çekiyoruz
  const products = await Product.find({}).sort({ createdAt: -1 }).lean();

  // MongoDB Object_id'lerini klişe serialize hatalarından kaçınmak için string'e çeviriyoruz
  const serializedProducts = products.map((p: any) => ({
    ...p,
    _id: p._id.toString(),
  }));

  return (
    <div className="p-8 lg:p-12">
      <div className="mb-8">
        <p className="text-sm font-medium uppercase tracking-widest text-nexa-electric-bright">
          Envanter ve Kataloğu
        </p>
        <h1 className="mt-2 font-display text-3xl font-bold tracking-tight text-white">
          Ürün & Fiyatlandırma Yönetimi
        </h1>
        <p className="mt-2 text-slate-400 text-sm">
          SaaS paketlerinin sürelerini, fiyatlarını, indirimlerini ve hizmet brifing parametrelerini bu ekrandan yönetin.
        </p>
      </div>

      {/* İnteraktif Arayüz Bileşeni */}
      <ProductListClient initialProducts={serializedProducts} />
    </div>
  );
}