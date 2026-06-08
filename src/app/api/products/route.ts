import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectMongoDB } from "@/lib/mongodb";
import { Product } from "@/models/Product";
import { buildPricingFromLegacy } from "@/lib/product-pricing";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 401 });
    }

    await connectMongoDB();

    const currentBusinessId =
      (session.user as { businessId?: string }).businessId ?? session.user.id;

    const products = await Product.find({ businessId: currentBusinessId }).sort(
      { createdAt: -1 },
    );

    return NextResponse.json(products, { status: 200 });
  } catch (error) {
    console.error("Ürünleri çekerken hata oluştu:", error);
    return NextResponse.json({ error: "Sunucu hatası" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 401 });
    }

    const body = await req.json();
    const { title, description, price, discountPrice, type } = body;

    if (!title || price == null || !type) {
      return NextResponse.json(
        { error: "Başlık, fiyat ve tür alanları zorunludur" },
        { status: 400 },
      );
    }

    await connectMongoDB();

    const currentBusinessId =
      (session.user as { businessId?: string }).businessId ?? session.user.id;

    const pricing = buildPricingFromLegacy({
      price: Number(price),
      discountPrice: discountPrice ? Number(discountPrice) : 0,
      type,
    });

    const newProduct = await Product.create({
      businessId: currentBusinessId,
      title,
      slug: title.toLowerCase().replace(/\s+/g, "-"),
      description: description ?? "",
      pricing,
      price: Number(price),
      discountPrice: discountPrice ? Number(discountPrice) : 0,
      type,
    });

    return NextResponse.json(
      { message: "Ürün başarıyla oluşturuldu", product: newProduct },
      { status: 201 },
    );
  } catch (error) {
    console.error("Ürün oluşturulurken hata:", error);
    return NextResponse.json({ error: "Ürün oluşturulamadı" }, { status: 500 });
  }
}
