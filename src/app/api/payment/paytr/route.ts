import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectMongoDB } from "@/lib/mongodb";
import { Product } from "@/models/Product";
import { Subscription } from "@/models/Subscription"; // 🔥 BU SATIRI EKLE
import crypto from "crypto";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Oturum bulunamadı" }, { status: 401 });
    }

    const { productId } = await req.json();
    if (!productId) {
      return NextResponse.json({ error: "Ürün ID eksik" }, { status: 400 });
    }

    await connectMongoDB();
    const product = await Product.findById(productId);

    if (!product) {
      return NextResponse.json({ error: "Ürün bulunamadı" }, { status: 404 });
    }

    // 1. Fiyat Hesaplama (PayTR kuruş ister: 100 TL için 10000 göndermeliyiz)
    // Güvenlik: Frontend'den gelen fiyata asla güvenmiyoruz, doğrudan DB'den kendi fiyatımızı çekiyoruz.
    const activePrice =
      product.discountPrice > 0 && product.discountPrice < product.price
        ? product.discountPrice
        : product.price;
    const payment_amount = Math.round(activePrice * 100);

    // 2. PayTR Gizli Ayarları (.env.local dosyasından alınıyor)
    const merchant_id = process.env.PAYTR_MERCHANT_ID!;
    const merchant_key = process.env.PAYTR_MERCHANT_KEY!;
    const merchant_salt = process.env.PAYTR_MERCHANT_SALT!;

    // 3. Sipariş Numarası ve Yönlendirme URL'leri
    const merchant_oid = `NEXA${Date.now()}${Math.floor(Math.random() * 1000)}`;
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const merchant_ok_url = `${appUrl}/profil?odeme=basarili`;
    const merchant_fail_url = `${appUrl}/checkout/${productId}?hata=odeme_basarisiz`;

    // 4. Müşteri Bilgileri
    const user_name = session.user.name || "Nexa Müşterisi";
    const user_address = "İskenderun, Hatay, Türkiye"; // PayTR boş adresi reddeder, standart/lokal bir dolgu
    const user_phone = "05555555555"; // Şimdilik standart, sonrasında profilden alınabilir

    // Gerçek IP adresini bulma (PayTR güvenlik için zorunlu tutar)
    const headersList = req.headers;
    const user_ip =
      headersList.get("x-forwarded-for")?.split(",")[0] || "127.0.0.1";

    // 5. Sepet İçeriği: [["Ürün Adı", "Fiyat", "Adet"]] formatında Base64'e çevrilmeli
    const user_basket = Buffer.from(
      JSON.stringify([[product.title, activePrice.toString(), 1]]),
    ).toString("base64");

    // 6. PayTR Ek Parametreleri
    const timeout_limit = "30";
    const debug_on = "1"; // Canlıya çıkarken bunu "0" yapacağız!
    const test_mode = "1"; // Canlıya çıkarken bunu "0" yapacağız!
    const no_installment = "0"; // Taksit yapılabilir (1 olursa yasaklanır)
    const max_installment = "12";
    const currency = "TL";

    // 7. PAYTR HASH OLUŞTURMA (En Kritik Adım: Dokümantasyona Birebir Uyumlu Şifreleme)
    const hash_str = `${merchant_id}${user_ip}${merchant_oid}${session.user.email}${payment_amount}${user_basket}${no_installment}${max_installment}${currency}${test_mode}`;
    const paytr_token = crypto
      .createHmac("sha256", merchant_key)
      .update(hash_str + merchant_salt)
      .digest("base64");
    // 🔥 İŞTE BURAYA EKLİYORUZ: PayTR'ye gitmeden önce veritabanına "ödeme bekliyor" izi bırakıyoruz
    await Subscription.create({
      userId: session.user.id,
      productId: product._id,
      status: "pending_payment", // Ödeme bekliyor statüsü
      merchantOid: merchant_oid, // PayTR'nin dönüşte arayacağı eşleştirme kodu
      startDate: new Date(),
      endDate: new Date(),
    });
    // 8. PayTR Sunucusuna İsteği Gönder
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
      // 🚀 Her şey yolunda, iFrame'in açılması için Token'ı frontend'e fırlatıyoruz
      return NextResponse.json({ token: paytrData.token });
    } else {
      console.error("PayTR Reddedildi:", paytrData.reason);
      return NextResponse.json({ error: paytrData.reason }, { status: 400 });
    }
  } catch (error) {
    console.error("Ödeme başlatma motoru hatası:", error);
    return NextResponse.json({ error: "Sunucu hatası" }, { status: 500 });
  }
}
