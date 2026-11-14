import { prisma } from "@/lib/prisma";
import { ServiceListClient } from "./ServiceListClient";

export const dynamic = "force-dynamic";

export default async function AdminHizmetlerPage() {
  let serialized: Record<string, unknown>[] = [];

  try {
    const dbServices = await prisma.product.findMany({
      where: {
        OR: [
          { pricingType: "QUOTE_BASED" },
          { category: "Custom Software" },
        ],
      },
      include: { plans: true },
      orderBy: { createdAt: "desc" },
    });

    serialized = dbServices.map((s) => {
      const price = Number(s.plans?.[0]?.monthlyPrice ?? 0);
      const features = Array.isArray(s.features) ? s.features.map(String) : [];

      return {
        _id: s.id,
        title: s.title,
        slug: s.slug,
        description: s.description,
        type: "service",
        price,
        pricing: {
          oneTime: price,
          currency: "TRY",
        },
        features,
        requiredFields: [],
        isActive: s.isActive,
      };
    });
  } catch (err) {
    console.warn("[AdminHizmetlerPage] Prisma sorgusu başarısız:", err);
  }

  return (
    <div className="p-8 lg:p-12">
      <div className="mb-8">
        <p className="text-sm font-medium uppercase tracking-widest text-purple-400">
          CMS — Hizmet Yönetimi (Prisma)
        </p>
        <h1 className="mt-2 font-display text-3xl font-bold tracking-tight text-white">
          Ajans Hizmetleri
        </h1>
        <p className="mt-2 text-slate-400 text-sm">
          /hizmetler sayfasında listelenen kurumsal hizmetleri buradan ekleyin, düzenleyin
          veya silin.
        </p>
      </div>

      <ServiceListClient initialServices={serialized} />
    </div>
  );
}
