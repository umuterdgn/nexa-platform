import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectMongoDB } from "@/lib/mongodb";
import { Product } from "@/models/Product";
import { buildPricingFromLegacy } from "@/lib/product-pricing";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-");
}

function resolveBusinessId(session: {
  user: { id?: string; businessId?: string };
}) {
  return session.user.businessId ?? session.user.id ?? "";
}

function buildServicePayload(body: Record<string, unknown>, businessId: string) {
  const price = Number(body.pricingOneTime ?? body.price ?? 0);

  const pricing = buildPricingFromLegacy({
    price,
    type: "service",
    pricing: {
      oneTime: price,
      currency: (body.currency as "TRY" | "USD" | "EUR") ?? "TRY",
    },
  });

  return {
    title: body.title as string,
    slug: slugify((body.slug as string) || (body.title as string)),
    description: body.description as string,
    type: "service" as const,
    businessId,
    pricing,
    price,
    discountPrice: 0,
    durationDays: 0,
    features: Array.isArray(body.features)
      ? body.features
      : String(body.features ?? "")
          .split(",")
          .map((f) => f.trim())
          .filter(Boolean),
    requiredFields: Array.isArray(body.requiredFields)
      ? body.requiredFields
      : String(body.requiredFields ?? "")
          .split(",")
          .map((f) => f.trim())
          .filter(Boolean),
    usageQuotas: {
      maxUsers: body.maxUsers ? Number(body.maxUsers) : undefined,
      maxTransactions: body.maxTransactions
        ? Number(body.maxTransactions)
        : undefined,
    },
    isActive: body.isActive !== false,
    sortOrder: body.sortOrder ? Number(body.sortOrder) : 0,
  };
}

/** GET — Public: vitrindeki aktif hizmetler */
export async function GET() {
  try {
    await connectMongoDB();
    const _force = Product.modelName;

    const services = await Product.find({
      type: "service",
      isActive: { $ne: false },
    })
      .sort({ sortOrder: 1, createdAt: -1 })
      .lean();

    return NextResponse.json(services);
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

    await connectMongoDB();
    const service = await Product.create(
      buildServicePayload(body, resolveBusinessId(session)),
    );

    revalidatePath("/hizmetler");
    revalidatePath("/urunler");

    return NextResponse.json({ success: true, service }, { status: 201 });
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

    await connectMongoDB();
    const service = await Product.findOneAndUpdate(
      { _id: serviceId, type: "service" },
      { $set: buildServicePayload(body, resolveBusinessId(session)) },
      { new: true, runValidators: true },
    );

    if (!service) {
      return NextResponse.json({ error: "Hizmet bulunamadı" }, { status: 404 });
    }

    revalidatePath("/hizmetler");
    revalidatePath("/urunler");

    return NextResponse.json({ success: true, service });
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

    await connectMongoDB();
    const deleted = await Product.findOneAndDelete({
      _id: serviceId,
      type: "service",
    });

    if (!deleted) {
      return NextResponse.json({ error: "Hizmet bulunamadı" }, { status: 404 });
    }

    revalidatePath("/hizmetler");
    revalidatePath("/urunler");

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Bilinmeyen hata";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
