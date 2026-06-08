import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectMongoDB } from "@/lib/mongodb";
import { Product } from "@/models/Product";

// 🚀 GET: İşletmenin SADECE KENDİ ürünlerini listeleme
export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 401 });
    }

    await connectMongoDB();

    // 🔥 Çok Kiracılı İzolasyon (Multi-tenant):
    // Kullanıcının businessId'si yoksa, kendi ID'sini işletme ID'si olarak kabul ediyoruz (Bireysel kullanım için)
    const currentBusinessId =
      (session.user as any).businessId || session.user.id;

    // Sadece bu işletmeye ait ürünleri, en yeniler en üstte olacak şekilde getir
    const products = await Product.find({ businessId: currentBusinessId }).sort(
      { createdAt: -1 },
    );

    return NextResponse.json(products, { status: 200 });
  } catch (error) {
    console.error("Ürünleri çekerken hata oluştu:", error);
    return NextResponse.json({ error: "Sunucu hatası" }, { status: 500 });
  }
}

// 🚀 POST: İşletme adına YENİ ürün oluşturma
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 401 });
    }

    const body = await req.json();
    const { title, description, price, discountPrice, type } = body;

    // Gerekli alanların kontrolü
    if (!title || !price || !type) {
      return NextResponse.json(
        { error: "Başlık, fiyat ve tür alanları zorunludur" },
        { status: 400 },
      );
    }

    await connectMongoDB();

    // 🔥 İşletme mühürünü hazırlıyoruz
    const currentBusinessId =
      (session.user as any).businessId || session.user.id;

    // Yeni ürünü veritabanına işletme mühürüyle birlikte kaydet
    const newProduct = await Product.create({
      businessId: currentBusinessId,
      title,
      description,
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
