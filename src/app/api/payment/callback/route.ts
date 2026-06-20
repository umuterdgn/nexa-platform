import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { connectMongoDB } from "@/lib/mongodb";
import { Subscription } from "@/models/Subscription";
import { Product } from "@/models/Product";
import User from "@/models/User";
import {
  getDurationDaysForCycle,
  getEffectivePrice,
} from "@/lib/product-pricing";
import crypto from "crypto";
import { Resend } from "resend";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";

// Resend API'yi başlatıyoruz
const resend = new Resend(process.env.RESEND_API_KEY);

// 🌟 EKLENEN SİHİRLİ FONKSİYON: PDF'in çökmesini engelleyen Türkçe karakter temizleyici
const clearTurkishChars = (str: string) => {
  if (!str) return "";
  return str
    .replace(/ğ/g, "g")
    .replace(/Ğ/g, "G")
    .replace(/ş/g, "s")
    .replace(/Ş/g, "S")
    .replace(/ı/g, "i")
    .replace(/İ/g, "I")
    .replace(/ö/g, "o")
    .replace(/Ö/g, "O")
    .replace(/ç/g, "c")
    .replace(/Ç/g, "C")
    .replace(/ü/g, "u")
    .replace(/Ü/g, "U");
};

async function sendPaymentReceipt(
  subscription: InstanceType<typeof Subscription>,
  product: InstanceType<typeof Product> | null,
  totalAmountKurus: string,
  merchantOid: string,
) {
  if (subscription.invoiceSent) return;

  const user = await User.findById(subscription.userId);
  if (!user?.email) return;

  const billingCycle = subscription.billingCycle ?? "monthly";
  const amount =
    product != null
      ? getEffectivePrice(product, billingCycle)
      : Number(totalAmountKurus) / 100;

  const currency = product?.pricing?.currency ?? "TRY";
  const paymentDate = new Date();
  const productName = product?.title ?? "Nexa Hizmeti";
  const customerName = user.name || user.email;

  // SADECE PDF içine yazılacak güvenli (İngilizce karakterli) metinler
  const safeProductName = clearTurkishChars(productName);
  const safeCustomerName = clearTurkishChars(customerName);

  try {
    // 1. PDF-LIB İLE DİNAMİK DEKONT ÇİZİMİ
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([595.28, 841.89]); // A4 Boyutu
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    // Başlık ve Logo Alanı
    page.drawText("Nexa.", {
      x: 50,
      y: 750,
      size: 36,
      font: boldFont,
      color: rgb(0.14, 0.38, 0.92),
    });
    page.drawText("DIJITAL DONUSUM PLATFORMU", {
      x: 50,
      y: 735,
      size: 10,
      font,
      color: rgb(0.4, 0.4, 0.4),
    });

    page.drawText("ODEME DEKONTU", {
      x: 50,
      y: 680,
      size: 20,
      font: boldFont,
      color: rgb(0, 0, 0),
    });
    page.drawLine({
      start: { x: 50, y: 660 },
      end: { x: 545, y: 660 },
      thickness: 1,
      color: rgb(0.8, 0.8, 0.8),
    });

    // Fatura Detayları (Burada patlamaması için 'safe' olanları kullanıyoruz)
    page.drawText("Musteri:", { x: 50, y: 630, size: 12, font: boldFont });
    page.drawText(safeCustomerName, { x: 150, y: 630, size: 12, font });

    page.drawText("Urun/Hizmet:", { x: 50, y: 600, size: 12, font: boldFont });
    page.drawText(safeProductName, { x: 150, y: 600, size: 12, font });

    page.drawText("Siparis No:", { x: 50, y: 570, size: 12, font: boldFont });
    page.drawText(merchantOid, { x: 150, y: 570, size: 12, font });

    page.drawText("Tarih:", { x: 50, y: 540, size: 12, font: boldFont });
    page.drawText(paymentDate.toLocaleDateString("tr-TR"), {
      x: 150,
      y: 540,
      size: 12,
      font,
    });

    // Tutar
    page.drawText("ODENEN TUTAR:", { x: 50, y: 490, size: 14, font: boldFont });
    page.drawText(`${amount} ${currency}`, {
      x: 200,
      y: 490,
      size: 14,
      font: boldFont,
      color: rgb(0.06, 0.72, 0.5),
    });

    // Alt Bilgi
    page.drawText("Bu belge mali deger tasimaz, bilgilendirme amaclidir.", {
      x: 50,
      y: 100,
      size: 10,
      font,
      color: rgb(0.5, 0.5, 0.5),
    });

    // PDF'i Buffer formatına çeviriyoruz
    const pdfBytes = await pdfDoc.save();
    const pdfBuffer = Buffer.from(pdfBytes);

    // 2. RESEND İLE E-POSTA VE PDF GÖNDERİMİ (HTML kısmında orijinal Türkçe isimleri kullanıyoruz, e-postada sorun olmaz)
    await resend.emails.send({
      from: "Nexa <info@nxa.com.tr>", // Resend'de onayladığın domain
      to: user.email,
      subject: `Nexa Platform - ${productName} Ödeme Dekontu`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
          <h2 style="color: #10b981;">Ödemeniz Başarıyla Alındı! ✅</h2>
          <p>Sayın <strong>${customerName}</strong>,</p>
          <p><strong>${productName}</strong> hizmeti için gerçekleştirdiğiniz <strong>${amount} ${currency}</strong> tutarındaki ödemeniz sistemimize başarıyla yansımış ve hizmetiniz aktif edilmiştir.</p>
          <div style="background-color: #f8fafc; padding: 15px; border-left: 4px solid #2563eb; margin: 20px 0;">
            <p style="margin: 0;"><strong>Sipariş No:</strong> ${merchantOid}</p>
          </div>
          <p>İşleminize ait detaylı dekont bu e-postanın ekinde (PDF) yer almaktadır.</p>
          <br/>
          <p style="font-size: 12px; color: #64748b;">© 2026 Nexa Platform. Tüm hakları saklıdır.</p>
        </div>
      `,
      attachments: [
        {
          filename: `Nexa_Dekont_${merchantOid}.pdf`,
          content: pdfBuffer,
        },
      ],
    });

    // Gönderim başarılıysa DB'yi güncelle
    subscription.invoiceSent = true;
    await subscription.save();

    console.log(
      `📧 Dekont e-postası Resend ile gönderildi: ${user.email} (${merchantOid})`,
    );
  } catch (error) {
    console.error("PDF oluşturma veya Resend e-posta gönderim hatası:", error);
  }
}

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

      const subscription = await Subscription.findOne({
        merchantOid: merchant_oid,
      });

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

        // 🌟 KESİN ÇÖZÜM: Vercel Serverless ortamında asenkron işlemlerin yarıda kesilmemesi için await kullanıyoruz!
        try {
          await sendPaymentReceipt(
            subscription,
            product,
            total_amount,
            merchant_oid,
          );
        } catch (emailError) {
          console.error("Dekont e-postası gönderilemedi:", emailError);
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
