import { NextResponse } from "next/server";
import { connectMongoDB } from "@/lib/mongodb";
import { Subscription } from "@/models/Subscription";
import crypto from "crypto";

export async function POST(req: Request) {
  try {
    // 1. PayTR verileri JSON olarak değil, URL-encoded (Form Data) olarak gönderir
    const formData = await req.formData();
    
    const merchant_oid = formData.get("merchant_oid") as string;
    const status = formData.get("status") as string;
    const total_amount = formData.get("total_amount") as string;
    const hash = formData.get("hash") as string;

    // .env.local dosyasındaki gizli anahtarlarımız
    const merchant_key = process.env.PAYTR_MERCHANT_KEY!;
    const merchant_salt = process.env.PAYTR_MERCHANT_SALT!;

    // 2. GÜVENLİK KONTROLÜ (PayTR Hash Doğrulama)
    // PayTR'den gelen verilerin yolda değiştirilmediğini ve gerçekten PayTR'den geldiğini kanıtlıyoruz
    const hash_str = `${merchant_oid}${merchant_salt}${status}${total_amount}`;
    const local_hash = crypto
      .createHmac("sha256", merchant_key)
      .update(hash_str)
      .digest("base64");

    // Eğer bizim ürettiğimiz mühür ile PayTR'nin gönderdiği mühür eşleşmiyorsa bu istek sahtedir!
    if (local_hash !== hash) {
      console.error("❌ GÜVENLİK UYARISI: PayTR Callback Hash Uyuşmuyor!");
      return new Response("FAIL", { status: 400 });
    }

    // 3. ÖDEME BAŞARILI MI?
    if (status === "success") {
      await connectMongoDB();

      // Ödeme başlatırken ürettiğimiz benzersiz merchant_oid kodunu veritabanında arıyoruz.
      // Not: Ödeme tetiklendiği an veritabanında 'pending_payment' durumunda bir Subscription 
      // oluşturmuş olmalıyız veya merchant_oid alanına bu kodu kaydetmiş olmalıyız.
      const subscription = await Subscription.findOne({ merchantOid: merchant_oid });

      if (subscription) {
        // Aboneliği aktif et ve süresini başlat!
        subscription.status = "active";
        subscription.startDate = new Date();
        
        // 30 günlük standart SaaS süresi ekleme
        const endDate = new Date();
        endDate.setDate(endDate.getDate() + 30);
        subscription.endDate = endDate;

        await subscription.save();
        console.log(`✅ Abonelik Başarıyla Aktif Edildi: ${merchant_oid}`);
      } else {
        console.error(`❓ Ödeme başarılı ancak veritabanında bu sipariş (merchant_oid) bulunamadı: ${merchant_oid}`);
        // Sipariş bulunamasa bile PayTR'ye OK dönüyoruz ki döngüye girmesin, loglardan biz inceleriz.
      }
    } else {
      console.log(`❌ Müşteri ödemeyi iptal etti veya kart reddedildi: ${merchant_oid}`);
      // İsteğe bağlı: Veritabanında siparişi 'failed' veya 'cancelled' olarak güncelleyebilirsin.
    }

    // 4. PAYTR'NİN BEKLEDİĞİ O SİHİRLİ CEVAP
    // PayTR sistemine "Mesajı aldım, her şey yolunda" raporu veriyoruz.
    return new Response("OK", {
      status: 200,
      headers: { "Content-Type": "text/plain" },
    });

  } catch (error) {
    console.error("PayTR Callback Sunucu Hatası:", error);
    return new Response("FAIL", { status: 500 });
  }
}