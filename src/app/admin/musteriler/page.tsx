import { prisma } from "@/lib/prisma";
import { CustomerClient } from "./CustomerClient";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Müşteri Portföyü & Abonelikler | Nexa Admin",
  description: "Prisma veritabanındaki tüm kayıtlı kurumsal müşteriler ve aktif lisans süreleri.",
};

export default async function AdminCustomersPage() {
  let serializedCustomers: any[] = [];

  try {
    const customers = await prisma.user.findMany({
      where: {
        role: { not: "admin" },
      },
      include: {
        subscriptions: {
          include: {
            product: true,
            plan: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    serializedCustomers = customers.map((c) => ({
      id: c.id,
      name: c.name || c.email.split("@")[0],
      email: c.email,
      companyName: c.companyName || null,
      phone: c.phone || null,
      createdAt: new Date(c.createdAt).toISOString(),
      subscriptions: (c.subscriptions || []).map((s) => ({
        id: s.id,
        status: s.status,
        startDate: new Date(s.startDate).toISOString(),
        endDate: new Date(s.endDate).toISOString(),
        product: s.product
          ? {
              id: s.product.id,
              title: s.product.title,
              type: s.product.pricingType,
            }
          : null,
      })),
    }));
  } catch (err) {
    console.warn("[AdminCustomersPage] Prisma müşteri sorgu uyarısı:", err);
  }

  return (
    <div className="p-8 lg:p-12 bg-slate-950 min-h-screen">
      <div className="mb-8">
        <p className="text-xs font-mono font-bold uppercase tracking-widest text-cyan-400">
          Prisma ORM &bull; Müşteri İlişkileri
        </p>
        <h1 className="mt-2 font-display text-3xl font-bold tracking-tight text-white">
          Müşteri Portföyü & Abonelik Yönetimi
        </h1>
        <p className="mt-2 text-slate-400 text-sm">
          Veritabanındaki tüm kayıtlı müşterileri filtreleyin, aktif lisans sürelerini takip
          edin ve hesap hareketlerini yönetin.
        </p>
      </div>

      <CustomerClient initialCustomers={serializedCustomers} />
    </div>
  );
}
