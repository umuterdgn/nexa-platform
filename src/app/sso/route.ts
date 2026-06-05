import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectMongoDB } from "@/lib/mongodb";
import { Subscription } from "@/models/Subscription";
import { Product } from "@/models/Product";
import jwt from "jsonwebtoken";

export async function GET(req: Request) {
  try {
    // 1. Kullanıcı gerçekten Nexa'ya giriş yapmış mı?
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Oturum bulunamadı" }, { status: 401 });
    }

    // 2. URL'den hangi aboneliğe gitmek istediğini al (Örn: /api/sso?subId=123)
    const url = new URL(req.url);
    const subId = url.searchParams.get("subId");
    
    if (!subId) {
      return NextResponse.redirect(new URL("/profil?error=eksik-parametre", req.url));
    }

    await connectMongoDB();
    const _force = Product.modelName;

    // 3. Güvenlik Duvarı: Bu abonelik gerçekten bu müşteriye mi ait ve AKTİF mi?
    const subscription = await Subscription.findOne({
      _id: subId,
      userId: session.user.id,
      status: "active",
    }).populate("productId");

    if (!subscription || !subscription.productId) {
      return NextResponse.redirect(new URL("/profil?error=yetkisiz-erisim", req.url));
    }

    // 4. Şifreli Biletin (JWT) İçeriğini Hazırla
    // Bu bilgileri diğer SaaS uygulaman okuyup müşteriyi içeri alacak
    const payload = {
      nexaUserId: session.user.id,
      email: session.user.email,
      name: session.user.name,
      productType: subscription.productId.type,
      productSlug: subscription.productId.slug,
      exp: Math.floor(Date.now() / 1000) + (60 * 5), // Bilet sadece 5 dakika geçerli!
    };

    // 5. Bileti Kilitle (Bu şifre .env.local dosyasında olmalı)
    const secretKey = process.env.SSO_SECRET_KEY || "nexa-cok-gizli-sso-anahtari-2026";
    const token = jwt.sign(payload, secretKey);

    // 6. Hedef SaaS Uygulamasının Adresini Belirle
    // Ürünün slug'ına göre farklı sitelere yönlendirebilirsin
    let targetAppUrl = "";
    
    if (subscription.productId.slug === "randevu-sistemi") {
      targetAppUrl = `https://randevu.nxa.online/api/auth/nexa-login?token=${token}`;
    } else if (subscription.productId.slug === "next-finance-erp") {
      targetAppUrl = `https://erp.nxa.online/api/auth/nexa-login?token=${token}`;
    } else {
      // Varsayılan veya test adresi
      targetAppUrl = `http://localhost:3001/api/auth/nexa-login?token=${token}`;
    }

    // 7. Müşteriyi şifreli biletiyle birlikte diğer SaaS uygulamasına fırlat
    return NextResponse.redirect(targetAppUrl, 302);

  } catch (error) {
    console.error("SSO Üretim Hatası:", error);
    return NextResponse.redirect(new URL("/profil?error=sunucu-hatasi", req.url));
  }
}