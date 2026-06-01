import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectMongoDB } from "@/lib/mongodb";
import { slugify } from "@/lib/slugify";
import { Product } from "@/models/Product";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user || session.user.role !== "admin") {
    return NextResponse.json({ error: "Yetkisiz erişim." }, { status: 403 });
  }

  try {
    const { title, description, price, features, type } = await req.json();

    if (!title?.trim() || !description?.trim() || price == null) {
      return NextResponse.json(
        { error: "Başlık, açıklama ve fiyat zorunludur." },
        { status: 400 }
      );
    }

    const featureList =
      typeof features === "string"
        ? features
            .split(",")
            .map((f: string) => f.trim())
            .filter(Boolean)
        : [];

    let slug = slugify(title);
    await connectMongoDB();

    const exists = await Product.findOne({ slug });
    if (exists) slug = `${slug}-${Date.now().toString(36)}`;

    const product = await Product.create({
      title: title.trim(),
      description: description.trim(),
      price: Number(price),
      type: type === "service" ? "service" : "saas",
      features: featureList,
      slug,
    });

    return NextResponse.json({ success: true, product }, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Ürün kaydedilemedi." },
      { status: 500 }
    );
  }
}
