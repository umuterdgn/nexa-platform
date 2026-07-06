import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectMongoDB } from "@/lib/mongodb";
import { Subscription } from "@/models/Subscription";
import { Product } from "@/models/Product";
import User from "@/models/User";
import { getDurationDaysForCycle } from "@/lib/product-pricing";

/**
 * PayTR merchant_ok_url sonrası çağrılır.
 * Webhook henüz ulaşmadıysa (test modu) pending aboneliği aktifleştirir.
 */
export async function POST() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Oturum bulunamadı" }, { status: 401 });
    }

    await connectMongoDB();

    const pending = await Subscription.findOne({
      userId: session.user.id,
      status: "pending_payment",
    }).sort({ createdAt: -1 });

    if (!pending) {
      const active = await Subscription.countDocuments({
        userId: session.user.id,
        status: "active",
        endDate: { $gt: new Date() },
      });

      return NextResponse.json({
        status: active > 0 ? "active" : "none",
      });
    }

    const isTestMode =
      process.env.PAYTR_TEST_MODE === "1" ||
      process.env.NODE_ENV === "development";

    if (!isTestMode) {
      return NextResponse.json({ status: "pending" });
    }

    const product = await Product.findById(pending.productId);
    const billingCycle = pending.billingCycle ?? "monthly";
    const durationDays = product
      ? getDurationDaysForCycle(product, billingCycle)
      : 30;

    const startDate = new Date();
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + (durationDays || 30));

    pending.status = "active";
    pending.startDate = startDate;
    pending.endDate = endDate;
    await pending.save();

    await User.findByIdAndUpdate(session.user.id, {
      $addToSet: { subscriptions: pending._id },
    });

    if (product) {
      await Product.findByIdAndUpdate(product._id, { $inc: { salesCount: 1 } });
    }

    revalidatePath("/profil");

    return NextResponse.json({ status: "active" });
  } catch (error) {
    console.error("Ödeme onay hatası:", error);
    return NextResponse.json({ error: "Sunucu hatası" }, { status: 500 });
  }
}

/** GET — polling için abonelik durumu */
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Oturum bulunamadı" }, { status: 401 });
    }

    await connectMongoDB();

    const activeCount = await Subscription.countDocuments({
      userId: session.user.id,
      status: "active",
      endDate: { $gt: new Date() },
    });

    const pendingCount = await Subscription.countDocuments({
      userId: session.user.id,
      status: "pending_payment",
    });

    return NextResponse.json({
      activeCount,
      pendingCount,
      hasActive: activeCount > 0,
    });
  } catch {
    return NextResponse.json({ error: "Sunucu hatası" }, { status: 500 });
  }
}
