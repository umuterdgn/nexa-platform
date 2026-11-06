import { prisma } from "@/lib/prisma";
import { DEFAULT_SAAS_CATALOG } from "@/lib/services/product-service";
import { ProductListClient } from "./ProductListClient";
import Link from "next/link";
import { PlusCircle, Database, Sparkles, Layers } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "B2B SaaS Ürün & Fiyatlandırma Yönetimi | Nexa Admin",
  description: "Prisma veritabanı destekli dinamik ürün kataloğu, SSO uç noktaları ve fiyatlandırma yönetimi.",
};

export default async function AdminProductsPage() {
  let products: any[] = [];

  try {
    const dbProducts = await (prisma as any).product.findMany({
      include: {
        plans: true,
        addons: true,
      },
      orderBy: { createdAt: "desc" },
    });

    if (dbProducts && dbProducts.length > 0) {
      products = dbProducts.map((p: any) => ({
        id: p.id,
        _id: p.id,
        slug: p.slug,
        title: p.title,
        tagline: p.tagline || "",
        description: p.description,
        badge: p.badge || "",
        category: p.category || "İnşaat & ERP",
        pricingType: p.pricingType || "SUBSCRIPTION",
        seoTitle: p.seoTitle || "",
        seoDescription: p.seoDescription || "",
        isActive: p.isActive,
        ssoUrl: p.ssoUrl || "",
        panelUrl: p.panelUrl || p.ssoUrl || "",
        features: p.features || [],
        plans: p.plans || [],
        addons: p.addons || [],
        price: p.plans?.[0]?.monthlyPrice ? Number(p.plans[0].monthlyPrice) : 0,
        discountPrice: p.plans?.[0]?.yearlyPrice ? Number(p.plans[0].yearlyPrice) : 0,
        durationDays: p.pricingType === "ONE_TIME" ? 0 : 365,
      }));
    }
  } catch (err) {
    console.warn("[Admin Products Page] Prisma sorgu uyarısı, varsayılan kataloğa geçiliyor:", err);
  }

  // Veritabanı boşsa veya henüz seed edilmediyse amiral B2B SaaS kataloğunu aktar
  if (products.length === 0) {
    products = Object.values(DEFAULT_SAAS_CATALOG).map((p) => {
      const basicPlan = p.plans[0];
      return {
        id: p.id,
        _id: p.id,
        slug: p.slug,
        title: p.title,
        tagline: p.tagline,
        description: p.description,
        badge: p.badge || "",
        category: p.category || "İnşaat & ERP",
        pricingType: p.pricingType || "SUBSCRIPTION",
        seoTitle: p.seoTitle || "",
        seoDescription: p.seoDescription || "",
        isActive: p.isActive,
        ssoUrl: p.ssoUrl || "",
        panelUrl: p.panelUrl || p.ssoUrl || "",
        features: (p.features || []).map((f) => f.title),
        plans: p.plans,
        addons: p.addons,
        price: basicPlan?.monthlyPrice || 0,
        discountPrice: basicPlan?.yearlyPrice || 0,
        durationDays: p.pricingType === "ONE_TIME" ? 0 : 365,
      };
    });
  }

  return (
        <div className="p-6 sm:p-10 lg:p-12 max-w-7xl mx-auto space-y-8">
          {/* Üst Bilgilendirme ve Eylemler */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 border-b border-slate-800 pb-8">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono font-semibold uppercase tracking-wider text-cyan-400 mb-2">
                <Database className="w-4 h-4 text-cyan-400" />
                <span>Prisma ORM & PostgreSQL Katalog Modülü</span>
              </div>
              <h1 className="text-3xl font-black tracking-tight text-white">
                B2B SaaS Ürün & Fiyatlandırma Yönetimi
              </h1>
              <p className="mt-2 text-sm text-slate-400 max-w-3xl">
                İnşaat CDE, Franchise Rollout, Kasa/POS ve Özel Yazılım paketlerinin vitrin görünürlüğünü, URL sluglarını, SSO adreslerini ve fiyat modellerini tek ekrandan yönetin.
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <Link
                href="/admin/urun-ekle"
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-cyan-500/20 hover:from-cyan-400 hover:to-blue-500 transition active:scale-95"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Yeni Ürün / SSO Ekle</span>
              </Link>
            </div>
          </div>

          {/* İnteraktif Kategori Filtreli ve 1-Tık Kopyalamalı İstemci Bileşeni */}
          <ProductListClient initialProducts={products} />
        </div>
        );
}
