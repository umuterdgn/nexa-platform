import { connectMongoDB } from "@/lib/mongodb";
import User from "@/models/User";
import { Product } from "@/models/Product";
import { Subscription } from "@/models/Subscription";
import { CustomerClient } from "./CustomerClient";

export const dynamic = "force-dynamic";

export default async function AdminCustomersPage() {
  await connectMongoDB();

  // Şema tetikleyicileri (Populate işlemi için modellerin önceden yüklenmesi şarttır)
  const _forceP = Product.modelName;
  const _forceS = Subscription.modelName;

  // Sadece müşterileri çekiyoruz ve içindeki subscriptions dizisini Product detaylarıyla birlikte genişletiyoruz
  const customers = await User.find({ role: { $ne: "admin" } })
    .populate({
      path: "subscriptions",
      model: Subscription,
      populate: {
        path: "productId",
        model: Product,
      },
    })
    .sort({ createdAt: -1 })
    .lean();

  // Next.js Server Component -> Client Component veri aktarımı için güvenli serileştirme
  const serializedCustomers = customers.map((c: any) => ({
    id: c._id.toString(),
    name: c.name,
    email: c.email,
    createdAt: c.createdAt.toISOString(),
    subscriptions: (c.subscriptions || []).map((s: any) => ({
      id: s._id.toString(),
      status: s.status,
      startDate: s.startDate.toISOString(),
      endDate: s.endDate.toISOString(),
      product: s.productId
        ? {
            id: s.productId._id.toString(),
            title: s.productId.title,
            type: s.productId.type,
          }
        : null,
    })),
  }));

  return (
    <div className="p-8 lg:p-12">
      <div className="mb-8">
        <p className="text-sm font-medium uppercase tracking-widest text-nexa-electric-bright">
          Müşteri İlişkileri
        </p>
        <h1 className="mt-2 font-display text-3xl font-bold tracking-tight text-white">
          CRM & Müşteri Yönetimi
        </h1>
        <p className="mt-2 text-slate-400 text-sm">
          Sistemdeki tüm müşterileri filtreleyin, aktif lisans sürelerini takip
          edin ve hesap hareketlerini yönetin.
        </p>
      </div>

      <CustomerClient initialCustomers={serializedCustomers} />
    </div>
  );
}
