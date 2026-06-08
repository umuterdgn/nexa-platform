import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { connectMongoDB } from "@/lib/mongodb";
import { Subscription } from "@/models/Subscription";
import { Product } from "@/models/Product";
import User from "@/models/User";
import { getDurationDaysForCycle } from "@/lib/product-pricing";
import crypto from "crypto";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    const merchant_oid = formData.get("merchant_oid") as string;
    const status = formData.get("status") as string;
    const total_amount = formData.get("total_amount") as string;
    const hash = formData.get("hash") as string;

    const merchant_key = process.env.PAYTR_MERCHANT_KEY!;
    const merchant_salt = process.env.PAYTR_MERCHANT_SALT!;

    const hash_str = `${merchant_oid}${merchant_salt}${status}${total_amount}`;
    const local_hash = crypto
      .createHmac("sha256", merchant_key)
      .update(hash_str)
      .digest("base64");

    if (local_hash !== hash) {
      console.error("❌ GÜVENLİK UYARISI: PayTR Callback Hash Uyuşmuyor!");
      return new Response("FAIL", { status: 400 });
    }

    if (status === "success") {
      await connectMongoDB();

      const subscription = await Subscription.findOne({ merchantOid: merchant_oid });

      if (subscription) {
        const product = await Product.findById(subscription.productId);
        const billingCycle = subscription.billingCycle ?? "monthly";
        const durationDays = product
          ? getDurationDaysForCycle(product, billingCycle)
          : 30;

        const startDate = new Date();
        const endDate = new Date(startDate);
        endDate.setDate(endDate.getDate() + (durationDays || 30));

        subscription.status = "active";
        subscription.startDate = startDate;
        subscription.endDate = endDate;
        await subscription.save();

        await User.findByIdAndUpdate(subscription.userId, {
          $addToSet: { subscriptions: subscription._id },
        });

        if (product) {
          await Product.findByIdAndUpdate(product._id, {
            $inc: { salesCount: 1 },
          });
        }

        revalidatePath("/profil");
        revalidatePath("/urunler");

        console.log(`✅ Abonelik Başarıyla Aktif Edildi: ${merchant_oid}`);
      } else {
        console.error(
          `❓ Ödeme başarılı ancak veritabanında bu sipariş (merchant_oid) bulunamadı: ${merchant_oid}`,
        );
      }
    } else {
      await connectMongoDB();
      await Subscription.findOneAndUpdate(
        { merchantOid: merchant_oid },
        { status: "cancelled" },
      );
      console.log(
        `❌ Müşteri ödemeyi iptal etti veya kart reddedildi: ${merchant_oid}`,
      );
    }

    return new Response("OK", {
      status: 200,
      headers: { "Content-Type": "text/plain" },
    });
  } catch (error) {
    console.error("PayTR Callback Sunucu Hatası:", error);
    return new Response("FAIL", { status: 500 });
  }
}
