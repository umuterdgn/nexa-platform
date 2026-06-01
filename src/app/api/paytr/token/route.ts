import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getProductById } from "@/lib/products-mock";
import { buildUserBasket, createPaytrToken } from "@/lib/paytr";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Oturum gerekli." }, { status: 401 });
  }

  const merchantId = process.env.PAYTR_MERCHANT_ID;
  const merchantKey = process.env.PAYTR_MERCHANT_KEY;
  const merchantSalt = process.env.PAYTR_MERCHANT_SALT;

  if (!merchantId || !merchantKey || !merchantSalt) {
    return NextResponse.json(
      { error: "PayTR yapılandırması eksik." },
      { status: 500 }
    );
  }

  const { productId } = await req.json();
  const product = getProductById(productId);

  if (!product) {
    return NextResponse.json({ error: "Ürün bulunamadı." }, { status: 404 });
  }

  const kdv = Math.round(product.price * 0.2);
  const totalTl = product.price + kdv;
  const paymentAmount = String(totalTl * 100); // kuruş

  const userIp =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    "127.0.0.1";

  const merchantOid = `NEXA${Date.now()}`;
  const email = session.user.email;
  const userBasket = buildUserBasket(product.title, totalTl);
  const noInstallment = "0";
  const maxInstallment = "0";
  const currency = "TL";
  const testMode = process.env.PAYTR_TEST_MODE ?? "1";

  const hashStr =
    merchantId +
    userIp +
    merchantOid +
    email +
    paymentAmount +
    userBasket +
    noInstallment +
    maxInstallment +
    currency +
    testMode;

  const paytrToken = createPaytrToken(hashStr, merchantKey, merchantSalt);
  const baseUrl = process.env.NEXTAUTH_URL ?? "http://localhost:3000";

  const body = new URLSearchParams({
    merchant_id: merchantId,
    user_ip: userIp,
    merchant_oid: merchantOid,
    email,
    payment_amount: paymentAmount,
    paytr_token: paytrToken,
    user_basket: userBasket,
    debug_on: testMode,
    test_mode: testMode,
    no_installment: noInstallment,
    max_installment: maxInstallment,
    currency,
    user_name: session.user.name ?? "Nexa Müşteri",
    user_address: "Türkiye",
    user_phone: "05555555555",
    merchant_ok_url: `${baseUrl}/profil?odeme=basarili`,
    merchant_fail_url: `${baseUrl}/checkout/${productId}?odeme=basarisiz`,
    timeout_limit: "30",
    lang: "tr",
  });

  try {
    const paytrRes = await fetch("https://www.paytr.com/odeme/api/get-token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: body.toString(),
    });

    const data = await paytrRes.json();

    if (data.status !== "success") {
      return NextResponse.json(
        { error: data.reason ?? "PayTR token alınamadı." },
        { status: 502 }
      );
    }

    return NextResponse.json({ token: data.token });
  } catch {
    return NextResponse.json(
      { error: "PayTR bağlantı hatası." },
      { status: 502 }
    );
  }
}
