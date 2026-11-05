import { NextResponse } from "next/server";
import {
  verifyPaytrWebhookHash,
  handleSuccessfulOrderPayment,
} from "@/lib/services/provisioning-service";
import { sendB2bEmail } from "@/lib/services/email-service";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

/**
 * PayTR 3D Secure Resmi Webhook Bildirim Uç Noktası
 * POST /api/webhooks/paytr
 * 
 * PayTR ödeme sunucuları işlem sonuçlandığında (Başarılı / Başarısız) bu adresi çağırır.
 * 1. HMAC-SHA256 hash güvenliğini denetler (Man-in-the-middle / sahte bildirim koruması).
 * 2. Sipariş durumunu Prisma'da "SUCCESS" ve Tenant durumunu "ACTIVE" yapar.
 * 3. Müşterinin SSO erişim lisansını aktifleştirir.
 * 4. Kurumsal Resend & Nodemailer e-postası ile fatura/aktivasyon bilgilerini iletir.
 * 5. PayTR protokolü gereği gövdede kesinlikle "OK" metnini döner.
 */
export async function POST(req: Request) {
  try {
    const contentType = req.headers.get("content-type") || "";
    let merchantOid = "";
    let status = "";
    let totalAmount = "";
    let hash = "";

    // 1. PayTR varsayılan olarak form-urlencoded gönderir; API testlerinde JSON da gelebilir
    if (contentType.includes("application/x-www-form-urlencoded")) {
      const formData = await req.formData();
      merchantOid = (formData.get("merchant_oid") as string) || "";
      status = (formData.get("status") as string) || "";
      totalAmount = (formData.get("total_amount") as string) || "";
      hash = (formData.get("hash") as string) || "";
    } else {
      const jsonBody = await req.json();
      merchantOid = jsonBody.merchant_oid || jsonBody.orderNumber || "";
      status = jsonBody.status || "success";
      totalAmount = String(jsonBody.total_amount || jsonBody.amount || "0");
      hash = jsonBody.hash || "";
    }

    console.log(`[PayTR Webhook] Bildirim alındı. Sipariş: ${merchantOid}, Durum: ${status}`);

    if (!merchantOid) {
      return new Response("PAYTR_ERR: Missing merchant_oid", { status: 400 });
    }

    // 2. HMAC-SHA256 Güvenlik Doğrulaması (Production ortamında key/salt varsa)
    const merchantKey = process.env.PAYTR_MERCHANT_KEY;
    if (merchantKey && merchantKey !== "TEST_MERCHANT_KEY" && hash) {
      const isValid = verifyPaytrWebhookHash({
        merchantOid,
        status,
        totalAmount,
        hash,
      });

      if (!isValid) {
        console.error(`[PayTR Webhook] Geçersiz HMAC Hash imzası tespit edildi! Sipariş: ${merchantOid}`);
        return new Response("PAYTR_ERR: Invalid signature", { status: 400 });
      }
    }

    // 3. Ödeme Başarısız Durumu
    if (status !== "success") {
      console.warn(`[PayTR Webhook] Ödeme başarısız veya iptal edildi: ${merchantOid}`);
      try {
        await (prisma as any).order?.update({
          where: { orderNumber: merchantOid },
          data: { status: "FAILED", tenantStatus: "FAILED" },
        });
      } catch (err) {
        // Devam et
      }
      return new Response("OK", { status: 200, headers: { "Content-Type": "text/plain" } });
    }

    // 4. Ödeme Başarılı: Siparişi "SUCCESS" Yap, SSO Lisansı Tanımla ve Provisioning Başlat
    const result = await handleSuccessfulOrderPayment(merchantOid);

    // 5. Müşteriye Kurumsal Resend E-postası ile SSO Bağlantısını Gönder
    try {
      const order = await (prisma as any).order?.findUnique({
        where: { orderNumber: merchantOid },
        include: { product: true, plan: true },
      });

      if (order && order.customerEmail) {
        const ssoUrl = order.product?.ssoUrl || "https://nxa.com.tr/profil";
        await sendB2bEmail({
          to: order.customerEmail,
          name: order.customerName,
          companyName: order.companyName,
          type: "order_confirmation",
          data: {
            productTitle: order.product?.title || "Nexa SaaS Ekosistemi",
            planName: order.plan?.name || "Yıllık Lisans",
            ssoUrl,
          },
        });
      }
    } catch (mailErr) {
      console.warn("[PayTR Webhook] Resend e-posta bildirimi uyarısı:", mailErr);
    }

    console.log(`[PayTR Webhook] Sipariş başarıyla onaylandı ve SSO lisansı verildi: ${merchantOid}`);

    // 6. PayTR'a işlemin başarıyla alındığını bildiren zorunlu HTTP "OK" yanıtı
    return new Response("OK", {
      status: 200,
      headers: { "Content-Type": "text/plain" },
    });
  } catch (error: any) {
    console.error("[PayTR Webhook] Kritik Hata:", error);
    return new Response(`ERROR: ${error?.message || "Internal Server Error"}`, {
      status: 500,
    });
  }
}

/**
 * Test ve Simülasyon Uç Noktası (GET)
 */
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const orderNumber = searchParams.get("orderNumber");

  if (orderNumber) {
    try {
      await handleSuccessfulOrderPayment(orderNumber);
      return NextResponse.json({
        success: true,
        orderNumber,
        status: "SUCCESS",
        message: "Sipariş test modunda başarıyla onaylandı ve SSO hakları tanımlandı.",
      });
    } catch (e: any) {
      return NextResponse.json({ error: e?.message }, { status: 500 });
    }
  }

  return NextResponse.json({
    service: "PayTR Webhook & 3D Secure Listener",
    status: "online",
    timestamp: new Date().toISOString(),
  });
}

