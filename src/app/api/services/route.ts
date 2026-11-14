import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-");
}

/** GET — Public: vitrindeki aktif hizmetler */
export async function GET() {
  try {
    const dbServices = await prisma.product.findMany({
      where: {
        isActive: true,
        OR: [
          { pricingType: "QUOTE_BASED" },
          { category: "Custom Software" },
        ],
      },
      include: { plans: true },
      orderBy: { createdAt: "desc" },
    });

    const formatted = dbServices.map((s) => {
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
        isActive: s.isActive,
      };
    });

    return NextResponse.json(formatted);
  } catch (error) {
    console.error("Hizmetler listelenirken hata:", error);
    return NextResponse.json({ error: "Sunucu hatası" }, { status: 500 });
  }
}

/** POST — Admin: yeni hizmet */
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 403 });
    }

    const body = await req.json();
    if (!body.title || body.pricingOneTime == null) {
      return NextResponse.json(
        { error: "Başlık ve fiyat zorunludur" },
        { status: 400 },
      );
    }

    const price = Number(body.pricingOneTime ?? body.price ?? 0);
    const slug = slugify((body.slug as string) || (body.title as string));
    const features = Array.isArray(body.features)
      ? body.features.map((f: string) => String(f))
      : String(body.features ?? "")
          .split(",")
          .map((f) => f.trim())
          .filter(Boolean);

    const created = await prisma.product.create({
      data: {
        title: String(body.title),
        slug,
        description: String(body.description ?? ""),
        category: "Custom Software",
        pricingType: "QUOTE_BASED",
        features,
        isActive: body.isActive !== false,
        plans: {
          create: [
            {
              tier: "ENTERPRISE",
              name: "Proje Bazlı",
              monthlyPrice: price,
              yearlyPrice: price,
            },
          ],
        },
      },
      include: { plans: true },
    });

    revalidatePath("/hizmetler");
    revalidatePath("/urunler");
    revalidatePath("/admin/hizmetler");

    return NextResponse.json({ success: true, service: created }, { status: 201 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Bilinmeyen hata";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

/** PUT — Admin: hizmet güncelle */
export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 403 });
    }

    const body = await req.json();
    const serviceId = body.id ?? body.productId;

    if (!serviceId) {
      return NextResponse.json({ error: "Hizmet ID eksik" }, { status: 400 });
    }

    const price = Number(body.pricingOneTime ?? body.price ?? 0);
    const slug = slugify((body.slug as string) || (body.title as string));
    const features = Array.isArray(body.features)
      ? body.features.map((f: string) => String(f))
      : String(body.features ?? "")
          .split(",")
          .map((f) => f.trim())
          .filter(Boolean);

    await prisma.pricingPlan.deleteMany({ where: { productId: String(serviceId) } });

    const updated = await prisma.product.update({
      where: { id: String(serviceId) },
      data: {
        title: String(body.title),
        slug,
        description: String(body.description ?? ""),
        features,
        isActive: body.isActive !== false,
        plans: {
          create: [
            {
              tier: "ENTERPRISE",
              name: "Proje Bazlı",
              monthlyPrice: price,
              yearlyPrice: price,
            },
          ],
        },
      },
      include: { plans: true },
    });

    revalidatePath("/hizmetler");
    revalidatePath("/urunler");
    revalidatePath("/admin/hizmetler");

    return NextResponse.json({ success: true, service: updated });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Bilinmeyen hata";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

/** DELETE — Admin: hizmet sil */
export async function DELETE(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const serviceId = searchParams.get("id");

    if (!serviceId) {
      return NextResponse.json({ error: "Hizmet ID eksik" }, { status: 400 });
    }

    await prisma.product.delete({
      where: { id: serviceId },
    });

    revalidatePath("/hizmetler");
    revalidatePath("/urunler");
    revalidatePath("/admin/hizmetler");

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Bilinmeyen hata";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
