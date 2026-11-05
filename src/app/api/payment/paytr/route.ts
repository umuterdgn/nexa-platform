import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectMongoDB } from "@/lib/mongodb";
import { Product } from "@/models/Product";
import { Subscription } from "@/models/Subscription";
import User from "@/models/User";
import {
  getDefaultBillingCycle,
  getDurationDaysForCycle,
  getEffectivePrice,
} from "@/lib/product-pricing";
import type { BillingCycle } from "@/types/product";
import crypto from "crypto";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email || !session.user.id) {
      return NextResponse.json({ error: "Oturum bulunamadı" }, { status: 401 });
    }

    const { productId, billingCycle: requestedCycle, planType } = await req.json();
    if (!productId) {
      return NextResponse.json({ error: "Ürün ID eksik" }, { status: 400 });
    }

    await connectMongoDB();
    const product = await Product.findById(productId);

    if (!product) {
      return NextResponse.json({ error: "Ürün bulunamadı" }, { status: 404 });
    }

    const billingCycle: BillingCycle =
      requestedCycle ?? getDefaultBillingCycle(product);
    const activePrice = getEffectivePrice(product, billingCycle);
    const payment_amount = Math.round(activePrice * 100);

    const merchant_id = process.env.PAYTR_MERCHANT_ID!;
    const merchant_key = process.env.PAYTR_MERCHANT_KEY!;
    const merchant_salt = process.env.PAYTR_MERCHANT_SALT!;

    const merchant_oid = `NEXA${Date.now()}${Math.floor(Math.random() * 1000)}`;
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://nxa.com.tr";
    const merchant_ok_url = `${appUrl}/profil?odeme=basarili`;
    const merchant_fail_url = `${appUrl}/checkout/${productId}?hata=odeme_basarisiz`;

    const user_name = session.user.name || "Nexa Müşterisi";
    const user_address = "İskenderun, Hatay, Türkiye";
    const user_phone = "05555555555";

    const headersList = req.headers;
    const user_ip =
      headersList.get("x-forwarded-for")?.split(",")[0] || "127.0.0.1";

    const user_basket = Buffer.from(
      JSON.stringify([[product.title, activePrice.toString(), 1]]),
    ).toString("base64");

    const timeout_limit = "30";
    const debug_on = "1";
    const test_mode = "1";
    const no_installment = "0";
    const max_installment = "12";
    const currency = "TL";

    const hash_str = `${merchant_id}${user_ip}${merchant_oid}${session.user.email}${payment_amount}${user_basket}${no_installment}${max_installment}${currency}${test_mode}`;
    const paytr_token = crypto
      .createHmac("sha256", merchant_key)
      .update(hash_str + merchant_salt)
      .digest("base64");

    const durationDays = getDurationDaysForCycle(product, billingCycle);
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + (durationDays || 30));

    const subscription = await Subscription.create({
      userId: session.user.id,
      productId: product._id,
      status: "pending_payment",
      billingCycle,
      planType,
      merchantOid: merchant_oid,
      invoiceSent: false,
      startDate: new Date(),
      endDate,
    });

    await User.findByIdAndUpdate(session.user.id, {
      $addToSet: { subscriptions: subscription._id },
    });

    const formData = new URLSearchParams();
    formData.append("merchant_id", merchant_id);
    formData.append("user_ip", user_ip);
    formData.append("merchant_oid", merchant_oid);
    formData.append("email", session.user.email);
    formData.append("payment_amount", payment_amount.toString());
    formData.append("paytr_token", paytr_token);
    formData.append("user_basket", user_basket);
    formData.append("debug_on", debug_on);
    formData.append("no_installment", no_installment);
    formData.append("max_installment", max_installment);
    formData.append("user_name", user_name);
    formData.append("user_address", user_address);
    formData.append("user_phone", user_phone);
    formData.append("merchant_ok_url", merchant_ok_url);
    formData.append("merchant_fail_url", merchant_fail_url);
    formData.append("timeout_limit", timeout_limit);
    formData.append("currency", currency);
    formData.append("test_mode", test_mode);

    const paytrRes = await fetch("https://www.paytr.com/odeme/api/get-token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: formData.toString(),
    });

    const paytrData = await paytrRes.json();

    if (paytrData.status === "success") {
      return NextResponse.json({ token: paytrData.token });
    }

    console.error("PayTR Reddedildi:", paytrData.reason);
    return NextResponse.json({ error: paytrData.reason }, { status: 400 });
  } catch (error) {
    console.error("Ödeme başlatma motoru hatası:", error);
    return NextResponse.json({ error: "Sunucu hatası" }, { status: 500 });
  }
}
