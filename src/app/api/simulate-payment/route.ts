import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectMongoDB } from "@/lib/mongodb";
import User from "@/models/User";
import { Product } from "@/models/Product";
import { Subscription } from "@/models/Subscription";
import jwt from "jsonwebtoken";

// SSO Token Üretim Fonksiyonu
function generateSSOToken(user: any, subscription: any): string {
  const payload = {
    nexaUserId: user._id.toString(),
    email: user.email,
    name: user.name,
    subscriptionId: subscription._id.toString(),
    productId: subscription.productId.toString(),
    exp: Math.floor(Date.now() / 1000) + 60 * 5, // 5 dakika geçerli
  };

  const secretKey = process.env.SSO_SECRET_KEY || "nexa-cok-gizli-sso-anahtari-2026";
  return jwt.sign(payload, secretKey);
}

export async function POST(req: Request) {
  try {
    // 1. Güvenlik Kontrolü: Oturum açılmış mı?
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.redirect(new URL("/auth/login", req.url), 303);
    }

    // 2. HTML Formundan gelen verileri FormData formatında yakalıyoruz (500 Hatasının Çözümü)
    const formData = await req.formData();
    const productId = formData.get("productId") as string;

    if (!productId) {
      return NextResponse.redirect(
        new URL("/urunler?error=id-eksik", req.url),
        303,
      );
    }

    await connectMongoDB();
    const _force = Product.modelName; // Turbopack şema tetikleyicisi

    // 3. Ürünü slug yerine gerçek veritabanı ID'si ile arıyoruz (Link tıklama hatasının çözümü)
    // Artık 'type: saas' kısıtlaması yok, böylece ajans hizmetleri de satın alınabilir
    const product = await Product.findById(productId);
    if (!product) {
      return NextResponse.redirect(
        new URL("/urunler?error=urun-bulunamadi", req.url),
        303,
      );
    }

    const startDate = new Date();
    const endDate = new Date(startDate);

    // 🎯 DİNAMİK SÜRE KONTROLÜ:
    // Admin panelinden o ürün için girdiğin gün sayısını (30 veya 365) doğrudan modelden çekiyoruz
    const duration = product.durationDays || 30;
    endDate.setDate(endDate.getDate() + duration);

    // 4. Senin Güvenlik Mantığın: Kullanıcının zaten aktif ve süresi bitmemiş bir aboneliği var mı?
    const existing = await Subscription.findOne({
      userId: session.user.id,
      productId: product._id,
      status: "active",
      endDate: { $gt: startDate },
    });

    if (existing) {
      // Zaten aktifse kullanıcıyı doğrudan paneline atıyoruz ve bilgilendiriyoruz
      return NextResponse.redirect(
        new URL("/profil?odeme=zaten-aktif", req.url),
        303,
      );
    }

    // 5. Yeni Abonelik/Hizmet kaydını dinamik süresiyle oluşturuyoruz
    const subscription = await Subscription.create({
      userId: session.user.id,
      productId: product._id,
      status: "active",
      startDate,
      endDate,
    });

    // 6. Aboneliği kullanıcının dökümanına senkronize ediyoruz
    await User.findByIdAndUpdate(session.user.id, {
      $addToSet: { subscriptions: subscription._id },
    });
    await Product.findByIdAndUpdate(product._id, {
      $inc: { salesCount: 1 },
    });

    // 7. SSO Token Üretimi ve Tam Vaktinde'ye Yönlendirme
    const user = await User.findById(session.user.id);
    if (user) {
      const ssoToken = generateSSOToken(user, subscription);
      const tamvaktindeUrl = `https://tamvaktinde.com.tr/auth/sso?token=${ssoToken}`;
      
      console.log(`🔄 SSO Token üretildi ve yönlendirme yapılıyor: ${tamvaktindeUrl}`);
      
      return NextResponse.redirect(tamvaktindeUrl, 302);
    }

    // 8. Fallback: Eğer user bulunamazsa profil sayfasına yönlendir
    return NextResponse.redirect(
      new URL("/profil?odeme=basarili", req.url),
      303,
    );
  } catch (error) {
    console.error("🚨 Ödeme simülasyonu hatası:", error);
    return NextResponse.json(
      { error: "Ödeme simülasyonu başarısız." },
      { status: 500 },
    );
  }
}
