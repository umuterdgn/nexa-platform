import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user?.role !== "admin") {
      return NextResponse.json({ error: "Yetkisiz Erişim" }, { status: 403 });
    }

    const { subscriptionId } = await req.json();

    if (!subscriptionId) {
      return NextResponse.json({ error: "Abonelik ID eksik" }, { status: 400 });
    }

    const updatedSub = await prisma.subscription.update({
      where: { id: subscriptionId },
      data: {
        status: "expired",
        endDate: new Date(),
      },
    });

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
