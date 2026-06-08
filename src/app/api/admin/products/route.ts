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

function buildProductPayload(body: Record<string, unknown>, businessId: string) {
  const type = (body.type as "saas" | "service") ?? "saas";
  const price = Number(body.price ?? 0);
  const discountPrice = body.discountPrice ? Number(body.discountPrice) : 0;

  const pricing = buildPricingFromLegacy({
    price,
    discountPrice,
    type,
    pricing: {
      monthly: body.pricingMonthly ? Number(body.pricingMonthly) : undefined,
      yearly: body.pricingYearly ? Number(body.pricingYearly) : undefined,
      oneTime: body.pricingOneTime ? Number(body.pricingOneTime) : undefined,
      discountMonthly: body.discountMonthly
        ? Number(body.discountMonthly)
        : undefined,
      discountYearly: body.discountYearly
        ? Number(body.discountYearly)
        : undefined,
      discountOneTime: body.discountOneTime
        ? Number(body.discountOneTime)
        : undefined,
      currency: (body.currency as "TRY" | "USD" | "EUR") ?? "TRY",
    },
  });

  return {
    title: body.title as string,
    slug: slugify((body.slug as string) || (body.title as string)),
    description: body.description as string,
    type,
    businessId,
    panelUrl: (body.panelUrl as string) || undefined,
    pricing,
    price,
    discountPrice,
    durationDays: type === "service" ? 0 : Number(body.durationDays ?? 30),
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

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user?.role !== "admin") {
      return NextResponse.json({ error: "Yetkisiz Erişim" }, { status: 403 });
    }

    const body = await req.json();
    await connectMongoDB();

    const payload = buildProductPayload(body, resolveBusinessId(session));

    const newProduct = await Product.create(payload);

    revalidatePath("/urunler");
    revalidatePath("/hizmetler");

    return NextResponse.json({ success: true, product: newProduct });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Bilinmeyen hata";
    console.error("Ürün ekleme hatası:", error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user?.role !== "admin") {
      return NextResponse.json({ error: "Yetkisiz Erişim" }, { status: 403 });
    }

    const body = await req.json();
    const productId = body.productId as string;

    if (!productId) {
      return NextResponse.json({ error: "Ürün ID'si eksik" }, { status: 400 });
    }

    await connectMongoDB();

    const payload = buildProductPayload(body, resolveBusinessId(session));

    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      { $set: payload },
      { new: true, runValidators: true },
    );

    revalidatePath("/urunler");
    revalidatePath("/hizmetler");

    return NextResponse.json({ success: true, product: updatedProduct });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Bilinmeyen hata";
    console.error("Ürün güncelleme hatası:", error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user?.role !== "admin") {
      return NextResponse.json({ error: "Yetkisiz Erişim" }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const productId = searchParams.get("id");

    if (!productId) {
      return NextResponse.json({ error: "Ürün ID'si eksik" }, { status: 400 });
    }

    await connectMongoDB();
    await Product.findByIdAndDelete(productId);

    revalidatePath("/urunler");
    revalidatePath("/hizmetler");

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Bilinmeyen hata";
    console.error("Ürün silme hatası:", error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
