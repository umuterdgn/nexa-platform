import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectMongoDB } from "@/lib/mongodb";
import { Product } from "@/models/Product";

// ➕ YENİ ÜRÜN EKLEME (POST)
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user?.role !== "admin") {
      return NextResponse.json({ error: "Yetkisiz Erişim" }, { status: 403 });
    }

    const body = await req.json();
    await connectMongoDB();

    const newProduct = await Product.create({
      title: body.title,
      slug: body.slug.toLowerCase().replace(/ /g, "-"),
      description: body.description,
      price: body.price,
      discountPrice: body.discountPrice,
      type: body.type,
      durationDays: body.type === "service" ? 0 : body.durationDays,
      features: body.features,
      requiredFields: body.requiredFields,
    });

    return NextResponse.json({ success: true, product: newProduct });
  } catch (error: any) {
    console.error("Ürün ekleme hatası:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user?.role !== "admin") {
      return NextResponse.json({ error: "Yetkisiz Erişim" }, { status: 403 });
    }

    const body = await req.json();
    const { productId } = body;

    if (!productId) {
      return NextResponse.json({ error: "Ürün ID'si eksik" }, { status: 400 });
    }

    await connectMongoDB();

    // 🎯 ÇÖZÜM: Tüm alanları Mongoose'a zorla dikte ediyoruz (Filtrelemeyi kırar)
    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      {
        $set: {
          title: body.title,
          slug: body.slug.toLowerCase().replace(/ /g, "-"),
          description: body.description,
          price: body.price,
          discountPrice: body.discountPrice,
          type: body.type,
          durationDays: body.type === "service" ? 0 : Number(body.durationDays), // Sayıya zorla çeviriyoruz
          features: body.features,
          requiredFields: body.requiredFields,
        }
      },
      { new: true, runValidators: true }
    );

    return NextResponse.json({ success: true, product: updatedProduct });
  } catch (error: any) {
    console.error("🚨 Ürün güncelleme hatası:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}