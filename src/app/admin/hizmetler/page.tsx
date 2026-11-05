import { connectMongoDB } from "@/lib/mongodb";
import { Product } from "@/models/Product";
import { ServiceListClient } from "./ServiceListClient";

export const dynamic = "force-dynamic";

export default async function AdminHizmetlerPage() {
  await connectMongoDB();
  const _force = Product.modelName;

  const services = await Product.find({ type: "service" })
    .sort({ sortOrder: 1, createdAt: -1 })
    .lean();

  const serialized = services.map((s) => ({
    ...s,
    _id: s._id.toString(),
  }));

  return (
    <div className="p-8 lg:p-12">
      <div className="mb-8">
        <p className="text-sm font-medium uppercase tracking-widest text-purple-400">
          CMS — Hizmet Yönetimi
        </p>
        <h1 className="mt-2 font-display text-3xl font-bold tracking-tight text-white">
          Ajans Hizmetleri
        </h1>
        <p className="mt-2 text-slate-400 text-sm">
          /hizmetler sayfasında listelenen hizmetleri buradan ekleyin, düzenleyin
          veya silin.
        </p>
      </div>

      <ServiceListClient initialServices={serialized} />
    </div>
  );
}
