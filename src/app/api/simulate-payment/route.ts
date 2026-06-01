import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectMongoDB } from "@/lib/mongodb";
import User from "@/models/User";
import { Product } from "@/models/Product";
import { Subscription } from "@/models/Subscription";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Oturum gerekli." }, { status: 401 });
    }

    const { productId } = await req.json();
    if (!productId) {
      return NextResponse.json({ error: "Ürün belirtilmedi." }, { status: 400 });
    }

    await connectMongoDB();

    const product = await Product.findOne({ slug: productId, type: "saas" });
    if (!product) {
      return NextResponse.json({ error: "Ürün bulunamadı." }, { status: 404 });
    }

    const startDate = new Date();
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 30);

    const existing = await Subscription.findOne({
      userId: session.user.id,
      productId: product._id,
      status: "active",
      endDate: { $gt: startDate },
    });

    if (existing) {
      return NextResponse.json({
        success: true,
        subscriptionId: existing._id,
        message: "Abonelik zaten aktif.",
      });
    }

    const subscription = await Subscription.create({
      userId: session.user.id,
      productId: product._id,
      status: "active",
      startDate,
      endDate,
    });

    await User.findByIdAndUpdate(session.user.id, {
      $addToSet: { subscriptions: subscription._id },
    });

    return NextResponse.json({
      success: true,
      subscriptionId: subscription._id,
    });
  } catch {
    return NextResponse.json(
      { error: "Ödeme simülasyonu başarısız." },
      { status: 500 }
    );
  }
}
