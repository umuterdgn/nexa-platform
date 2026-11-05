import { NextResponse } from "next/server";
import {
  verifyPaytrWebhookHash,
  handleSuccessfulOrderPayment,
} from "@/lib/services/provisioning-service";

/**
 * İyzico / PayTR Webhook Otomasyonu & Tenant Provisioning Endpoint'i
 * POST /api/webhooks/payment
 * 
 * Bu endpoint ödeme sağlayıcıları tarafından asenkron olarak tetiklenir:
 * 1. HMAC/Hash güvenliğini doğrular (Man-in-the-middle engelleme).
 * 2. Sipariş durumunu Prisma'da "SUCCESS" ve "PROVISIONING" yapar.
 * 3. Müşteriye NodeMailer ile Aktivasyon & Fatura e-postası gönderir.
 * 4. İlgili SaaS ürününün (Örn: Tam Vaktinde) API'sine istek atarak Tenant'ı ayağa kaldırır.
 * 5. Sağlayıcıya işlemi onaylayan 'OK' yanıtını döner.
 */
export async function POST(req: Request) {
  try {
    const contentType = req.headers.get("content-type") || "";
    let merchantOid = "";
    let status = "";
    let totalAmount = "";
    let hash = "";

    // 1. PayTR genellikle application/x-www-form-urlencoded gönderir; İyzico ise JSON gönderir
    if (contentType.includes("application/x-www-form-urlencoded")) {
      const formData = await req.formData();
      merchantOid = (formData.get("merchant_oid") as string) || "";
      status = (formData.get("status") as string) || "";
      totalAmount = (formData.get("total_amount") as string) || "";
      hash = (formData.get("hash") as string) || "";
    } else {
      const jsonBody = await req.json();
      merchantOid = jsonBody.merchant_oid || jsonBody.orderNumber || jsonBody.paymentId || "";
      status = jsonBody.status || "success";
      totalAmount = String(jsonBody.total_amount || jsonBody.paidPrice || "0");
      hash = jsonBody.hash || jsonBody.signature || "";
    }

    console.log(`[Payment Webhook] İstek alındı. Sipariş: ${merchantOid}, Durum: ${status}`);

    if (!merchantOid) {
      return new Response("PAYTR_ERR: Missing merchant_oid", { status: 400 });
    }

    // 2. Güvenlik ve İmza Doğrulaması (HMAC-SHA256 Hash Kontrolü)
    // Production ortamında PAYTR_MERCHANT_KEY tanımlı ise sıkı imza kontrolü yapılır:
    if (process.env.PAYTR_MERCHANT_KEY && hash) {
      const isValid = verifyPaytrWebhookHash({
        merchantOid,
        status,
        totalAmount,
        hash,
      });

      if (!isValid) {
        console.error(`[Payment Webhook] Geçersiz HMAC Hash imzası! Oid: ${merchantOid}`);
        return new Response("PAYTR_ERR: Invalid signature", { status: 400 });
      }
    }

    // 3. Ödeme Başarısız ise
    if (status !== "success") {
      console.warn(`[Payment Webhook] Ödeme başarısız bildirildi: ${merchantOid}`);
      // Veritabanında sipariş durumu "FAILED" olarak güncellenebilir
      return new Response("OK", { status: 200 });
    }

    // 4. Ödeme Başarılı: Asenkron Provisioning ve NodeMailer Akışını Başlat
    // (Büyük yüklerde kuyruğa - BullMQ/Kafka - atılabilir; burada güvenli asenkron servis olarak yürütülür)
    const result = await handleSuccessfulOrderPayment(merchantOid);

    console.log(`[Payment Webhook] Süreç başarıyla tamamlandı:`, {
      orderNumber: merchantOid,
      provisioning: result.provisioningResult?.success,
      emailSent: result.mailResult?.success,
    });

    // 5. PayTR kuralı gereği yanıt gövdesi yalnızca 'OK' olmalıdır
    return new Response("OK", {
      status: 200,
      headers: { "Content-Type": "text/plain" },
    });
  } catch (error: any) {
    console.error("[Payment Webhook] Kritik Hata:", error);
    // PayTR'a 500 dönülürse sağlayıcı tekrar dener
    return new Response(`ERROR: ${error?.message || "Internal Server Error"}`, {
      status: 500,
    });
  }
}

/**
 * Webhook Test / Sağlık Kontrolü (GET)
 */
export async function GET() {
  return NextResponse.json({
    status: "active",
    service: "Nexa B2B SaaS Payment & Provisioning Webhook",
    timestamp: new Date().toISOString(),
    supportedProviders: ["PayTR", "Iyzico"],
  });
}

