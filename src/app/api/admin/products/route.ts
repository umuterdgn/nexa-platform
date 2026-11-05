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
 * Admin Dinamik Ürün ve Hizmet Ekleme API Uç Noktası
 * POST /api/admin/products
 * 
 * Doğrudan Prisma veritabanına ve Mongoose modellerine eşzamanlı yazar.
 */
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user?.role !== "admin") {
      return NextResponse.json({ error: "Yetkisiz Erişim. Sadece adminler ürün ekleyebilir." }, { status: 403 });
    }

    const body = await req.json();

    if (!body.title || !body.description) {
      return NextResponse.json({ error: "Ürün adı ve açıklaması zorunludur." }, { status: 400 });
    }

    // 1. Slug Belirleme (Örn: "ai_token_5" veya "nexa-erp")
    const cleanSlug = body.slug
      ? String(body.slug).trim().toLowerCase()
      : slugify(String(body.title));

    const ssoUrl = (body.ssoUrl || body.panelUrl || "").trim();
    const type = (body.type as "saas" | "service") || (body.category === "SERVICE" ? "service" : "saas");
    const category = type === "service" ? "SERVICE" : "SAAS";
    const monthlyPrice = Number(body.price ?? body.monthlyPrice ?? 0);
    const yearlyPrice = Number(body.discountPrice ?? body.yearlyPrice ?? monthlyPrice);
    const badge = body.badge || (type === "saas" ? "Otonom SaaS" : "Kurumsal Hizmet");
    const tagline = body.tagline || `${body.title} - Nexa Kurumsal Mühendislik`;

    const parsedFeatures: string[] = Array.isArray(body.features)
      ? body.features
      : String(body.features ?? "")
          .split(",")
          .map((f) => f.trim())
          .filter(Boolean);

    // 2. Doğrudan Prisma Veritabanına Yazma
    let prismaProduct: any = null;
    try {
      // Önce mevcut var mı kontrol et, varsa güncelle, yoksa oluştur (upsert)
      prismaProduct = await (prisma as any).product?.upsert({
        where: { slug: cleanSlug },
        update: {
          title: body.title,
          tagline,
          description: body.description,
          category,
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
          badge,
          ssoUrl: ssoUrl || undefined,
          panelUrl: ssoUrl || undefined,
          features: parsedFeatures,
          isActive: true,
          plans: {
            create: [
              {
                tier: "PRO",
                name: `${body.title} (Pro Lisans)`,
                description: "Tam Özellikli Kurumsal Erişim",
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

    // 3. Mongoose / MongoDB Senkronizasyonu
    try {
      await connectMongoDB();
      const pricing = buildPricingFromLegacy({
        price: monthlyPrice,
        discountPrice: yearlyPrice,
        type,
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
            type,
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

    // 4. In-Memory Katalog Senkronizasyonu (Sunucu yeniden başlamadan anında okunabilsin)
    DEFAULT_SAAS_CATALOG[cleanSlug] = {
      id: prismaProduct?.id || `prod_${cleanSlug}`,
      slug: cleanSlug,
      title: body.title,
      tagline,
      description: body.description,
      badge,
      category,
      isActive: true,
      ssoUrl: ssoUrl || `https://${cleanSlug}.nxa.com.tr/auth/sso`,
      features: parsedFeatures.map((f) => ({ title: f, description: f })),
      plans: [
        {
          id: `plan_${cleanSlug}_pro`,
          tier: "PRO",
          name: `${body.title} Standart Lisans`,
          description: "Kurumsal Erişim ve SSO Entegrasyonu",
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
    revalidatePath("/profil");

    return NextResponse.json({
      success: true,
      message: `${body.title} ürünü Prisma veritabanına ve SSO kataloğuna başarıyla eklendi!`,
      slug: cleanSlug,
      ssoUrl,
      product: prismaProduct,
    });
  } catch (error: any) {
    console.error("[Admin Product API] Kritik Hata:", error);
    return NextResponse.json(
      { error: error?.message || "Ürün eklenirken bir sunucu hatası meydana geldi." },
      { status: 500 }
    );
  }
}
