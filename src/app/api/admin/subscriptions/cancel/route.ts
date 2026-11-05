import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectMongoDB } from "@/lib/mongodb";
import { Subscription } from "@/models/Subscription";

export async function POST(req: Request) {
  try {
    // Sadece admin yetkisi olanlar bu tetikleyiciyi kullanabilir
    const session = await getServerSession(authOptions);
    if (!session || session.user?.role !== "admin") {
      return NextResponse.json({ error: "Yetkisiz Erişim" }, { status: 403 });
    }

    const { subscriptionId } = await req.json();

    if (!subscriptionId) {
      return NextResponse.json({ error: "Abonelik ID eksik" }, { status: 400 });
    }

    await connectMongoDB();

    // Aboneliğin durumunu 'cancelled' olarak güncelliyoruz.
    // Artık bu müşteri profiline girdiğinde ürünü aktif kullanamayacak.
    const updatedSub = await Subscription.findByIdAndUpdate(
      subscriptionId,
      { $set: { status: "cancelled", endDate: new Date() } }, // Süreyi de anında bitiriyoruz
      { new: true },
    );

    if (!updatedSub) {
      return NextResponse.json(
        { error: "Abonelik bulunamadı" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      message: "Abonelik iptal edildi",
    });
  } catch (error: any) {
    console.error("Abonelik iptal hatası:", error);
    return NextResponse.json({ error: "İç sunucu hatası" }, { status: 500 });
  }
}
