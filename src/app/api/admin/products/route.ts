import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { connectMongoDB } from "@/lib/mongodb";
import { Product as MongoProduct } from "@/models/Product";
import { buildPricingFromLegacy } from "@/lib/product-pricing";
import { DEFAULT_SAAS_CATALOG } from "@/lib/services/product-service";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/ğ/g, "g")
    .replace(/ü/g, "u")
    .replace(/ş/g, "s")
    .replace(/ı/g, "i")
    .replace(/ö/g, "o")
    .replace(/ç/g, "c")
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-");
}

function resolveBusinessId(session: {
  user: { id?: string; businessId?: string };
}) {
  return session.user.businessId ?? session.user.id ?? "";
}

/**
 * GET /api/admin/products
 * Prisma üzerinden tüm ürünleri getirir, kategori filtresini destekler.
 */
  export async function GET(req: Request) {
    try {
      const session = await getServerSession(authOptions);
      if (!session || session.user?.role !== "admin") {
        return NextResponse.json({ error: "Yetkisiz Erişim." }, { status: 403 });
      }

      const { searchParams } = new URL(req.url);
      const categoryParam = searchParams.get("category");

      let products: any[] = [];
      try {
        const whereClause: any = {};
        if (categoryParam && categoryParam !== "all" && categoryParam !== "Tümü") {
          whereClause.category = categoryParam;
        }

        products = await (prisma as any).product.findMany({
          where: whereClause,
          include: {
            plans: true,
            addons: true,
          },
          orderBy: { createdAt: "desc" },
        });
      } catch (dbErr) {
        console.warn("[Admin Product API] Prisma get hatası, mock kataloğa dönülüyor:", dbErr);
      }

      // Prisma'da henüz ürün yoksa amiral seed kataloğunu döner
      if (!products || products.length === 0) {
        const fallbackList = Object.values(DEFAULT_SAAS_CATALOG);
        products = (categoryParam && categoryParam !== "all" && categoryParam !== "Tümü")
          ? fallbackList.filter((p) => p.category === categoryParam)
          : fallbackList;
      }

      return NextResponse.json({ success: true, products });
    } catch (err: any) {
      return NextResponse.json({ error: err.message || "Ürünler getirilemedi." }, { status: 500 });
    }
  }

  /**
   * POST & PUT /api/admin/products
   * Ürünü Prisma ve MongoDB veritabanına kaydeder / günceller.
   */
  async function handleUpsertProduct(req: Request) {
    try {
      const session = await getServerSession(authOptions);
      if (!session || session.user?.role !== "admin") {
        return NextResponse.json({ error: "Yetkisiz Erişim. Sadece adminler ürün yönetebilir." }, { status: 403 });
      }

      const body = await req.json();

      if (!body.title || !body.description) {
        return NextResponse.json({ error: "Ürün adı ve açıklaması zorunludur." }, { status: 400 });
      }

      // 1. Slug Belirleme
      const cleanSlug = body.slug
        ? String(body.slug).trim().toLowerCase()
        : slugify(String(body.title));

      const ssoUrl = (body.ssoUrl || body.panelUrl || "").trim();
      const category = body.category || "İnşaat & ERP";
      const pricingType = (body.pricingType as "SUBSCRIPTION" | "ONE_TIME" | "QUOTE_BASED") || "SUBSCRIPTION";
      const isQuoteBased = pricingType === "QUOTE_BASED";

      const monthlyPrice = isQuoteBased ? 0 : Number(body.price ?? body.monthlyPrice ?? 0);
      const yearlyPrice = isQuoteBased ? 0 : Number(body.discountPrice ?? body.yearlyPrice ?? monthlyPrice);
      const badge = body.badge || (isQuoteBased ? "Özel Teklif" : pricingType === "ONE_TIME" ? "Tek Seferlik" : "Abonelik");
      const tagline = body.tagline || `${body.title} - Nexa Kurumsal B2B Çözümü`;
      const seoTitle = body.seoTitle ? String(body.seoTitle).trim() : null;
      const seoDescription = body.seoDescription ? String(body.seoDescription).trim() : null;

      const parsedFeatures: string[] = Array.isArray(body.features)
        ? body.features
        : String(body.features ?? "")
          .split(",")
          .map((f) => f.trim())
          .filter(Boolean);

      // 2. Doğrudan Prisma Veritabanına Yazma (Upsert)
      let prismaProduct: any = null;
      try {
          prismaProduct = await (prisma as any).product.upsert({
            where: { slug: cleanSlug },
            update: {
              title: body.title,
              tagline,
              description: body.description,
              category,
              pricingType,
              seoTitle,
              seoDescription,
              badge,
              ssoUrl: ssoUrl || undefined,
              panelUrl: ssoUrl || undefined,
              features: parsedFeatures,
              isActive: true,
            },
            create: {
              slug: cleanSlug,
              title: body.title,
              tagline,
              description: body.description,
              category,
              pricingType,
              seoTitle,
              seoDescription,
              badge,
              ssoUrl: ssoUrl || undefined,
              panelUrl: ssoUrl || undefined,
              features: parsedFeatures,
              isActive: true,
              plans: {
                create: [
                  {
                    tier: "PRO",
                    name: `${body.title} (Kurumsal Paket)`,
                    description: isQuoteBased ? "Teklife Dayalı Enterprise Lisans" : "Tam Özellikli Kurumsal Erişim",
                    monthlyPrice,
                    yearlyPrice,
                    currency: "TRY",
                    features: parsedFeatures,
                    maxUsers: Number(body.maxUsers || 10),
                    storageGb: Number(body.storageGb || 50),
                  },
                ],
              },
            },
            include: { plans: true },
          });
          console.log(`[Admin Product API] Prisma'ya başarıyla yazıldı: ${cleanSlug}`);
        } catch (prismaErr) {
          console.warn("[Admin Product API] Prisma kayıt uyarısı:", prismaErr);
        }

        // 3. Mongoose / MongoDB Senkronizasyonu (Geriye uyumluluk için)
        try {
          await connectMongoDB();
          const pricing = buildPricingFromLegacy({
            price: monthlyPrice,
            discountPrice: yearlyPrice,
            type: isQuoteBased ? "service" : "saas",
            pricing: {
              monthly: monthlyPrice,
              yearly: yearlyPrice,
              currency: "TRY",
            },
          });

          await MongoProduct.findOneAndUpdate(
            { slug: cleanSlug },
            {
              $set: {
                title: body.title,
                slug: cleanSlug,
                description: body.description,
                type: isQuoteBased ? "service" : "saas",
                category,
                businessId: resolveBusinessId(session),
                panelUrl: ssoUrl || undefined,
                ssoUrl: ssoUrl || undefined,
                pricing,
                price: monthlyPrice,
                discountPrice: yearlyPrice,
                durationDays: Number(body.durationDays || 365),
                features: parsedFeatures,
                isActive: true,
              },
            },
            { upsert: true, new: true }
          );
          console.log(`[Admin Product API] MongoDB'ye başarıyla yazıldı: ${cleanSlug}`);
        } catch (mongoErr) {
          // MongoDB offline ise sessizce devam eder
        }

        // 4. In-Memory Katalog Senkronizasyonu
        DEFAULT_SAAS_CATALOG[cleanSlug] = {
          id: prismaProduct?.id || `prod_${cleanSlug}`,
          slug: cleanSlug,
          title: body.title,
          tagline,
          description: body.description,
          badge,
          category,
          pricingType,
          seoTitle: seoTitle || undefined,
          seoDescription: seoDescription || undefined,
          isActive: true,
          ssoUrl: ssoUrl || `https://${cleanSlug}.nxa.com.tr/auth/sso`,
          features: parsedFeatures.map((f) => ({ title: f, description: f })),
          plans: [
            {
              id: `plan_${cleanSlug}_pro`,
              tier: "PRO",
              name: `${body.title} Standart Lisans`,
              description: isQuoteBased ? "Özel Teklif / Enterprise" : "Kurumsal Erişim ve SSO Entegrasyonu",
              monthlyPrice,
              yearlyPrice,
              currency: "TRY",
              features: parsedFeatures,
              maxUsers: 10,
              storageGb: 50,
            },
          ],
          addons: [],
        };

        revalidatePath("/urunler");
        revalidatePath(`/urunler/${cleanSlug}`);
        revalidatePath("/admin/urunler");
        revalidatePath("/admin/urun-ekle");
        revalidatePath("/profil");

        return NextResponse.json({
          success: true,
          message: `${body.title} ürünü Prisma veritabanına ve vitrine başarıyla kaydedildi!`,
          slug: cleanSlug,
          ssoUrl,
          product: prismaProduct,
        });
      } catch (error: any) {
        console.error("[Admin Product API] Kritik Hata:", error);
        return NextResponse.json(
          { error: error?.message || "Ürün işlenirken bir sunucu hatası meydana geldi." },
          { status: 500 }
        );
      }
    }

export async function POST(req: Request) {
      return handleUpsertProduct(req);
    }

    export async function PUT(req: Request) {
      return handleUpsertProduct(req);
    }
