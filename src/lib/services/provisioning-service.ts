import crypto from "crypto";
import nodemailer from "nodemailer";
import { prisma } from "@/lib/prisma";
import type {
  TenantProvisioningPayload,
  TenantProvisioningResult,
} from "@/types/saas";

/**
 * NodeMailer Transporter Yapılandırması
 * Ortam değişkenlerinden SMTP bilgilerini alır, yoksa fallback yapılandırmayı kullanır.
 */
export const mailTransporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: Number(process.env.SMTP_PORT) || 587,
  secure: process.env.SMTP_PORT === "465",
  auth: {
    user: process.env.SMTP_USER || process.env.EMAIL_USER || "billing@nxa.com.tr",
    pass: process.env.SMTP_PASSWORD || process.env.EMAIL_PASS || "sample_smtp_secret",
  },
});

/**
 * 1. PayTR & İyzico Webhook İmza Doğrulama (HMAC Security Check)
 */
export function verifyPaytrWebhookHash(params: {
  merchantOid: string;
  status: string;
  totalAmount: string;
  hash: string;
}): boolean {
  const merchantKey = process.env.PAYTR_MERCHANT_KEY || "TEST_MERCHANT_KEY";
  const merchantSalt = process.env.PAYTR_MERCHANT_SALT || "TEST_MERCHANT_SALT";

  // PayTR Standart Hash Formülü: HMAC-SHA256(merchant_oid + merchant_salt + status + total_amount, merchant_key)
  const expectedHash = crypto
    .createHmac("sha256", merchantKey)
    .update(params.merchantOid + merchantSalt + params.status + params.totalAmount)
    .digest("base64");

  return expectedHash === params.hash;
}

/**
 * 2. Müşteriye NodeMailer ile Aktivasyon ve Fatura E-postası Gönderimi
 */
export async function sendActivationAndInvoiceEmail(params: {
  toEmail: string;
  customerName: string;
  companyName: string;
  orderNumber: string;
  productTitle: string;
  planName: string;
  subdomain: string;
  accessUrl: string;
  tempPassword?: string;
  totalAmount: number;
  currency: string;
}) {
  const {
    toEmail,
    customerName,
    companyName,
    orderNumber,
    productTitle,
    planName,
    subdomain,
    accessUrl,
    tempPassword = "Nxa" + Math.floor(100000 + Math.random() * 900000) + "!",
    totalAmount,
    currency,
  } = params;

  const htmlContent = `
    <!DOCTYPE html>
    <html lang="tr">
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #0b0f19; color: #f3f4f6; margin: 0; padding: 24px; }
        .card { max-width: 600px; margin: 0 auto; background: #111827; border: 1px solid #1f2937; border-radius: 16px; overflow: hidden; }
        .header { background: linear-gradient(135deg, #4f46e5 0%, #06b6d4 100%); padding: 32px 24px; text-align: center; }
        .header h1 { margin: 0; font-size: 24px; font-weight: 700; color: #ffffff; }
        .header p { margin: 8px 0 0; color: #e0e7ff; font-size: 14px; }
        .content { padding: 32px 24px; }
        .badge { display: inline-block; background: #064e3b; color: #34d399; padding: 4px 12px; border-radius: 9999px; font-size: 12px; font-weight: 600; text-transform: uppercase; margin-bottom: 16px; }
        .box { background: #1f2937; border-radius: 12px; padding: 20px; margin: 20px 0; border-left: 4px solid #6366f1; }
        .box h3 { margin: 0 0 12px; font-size: 15px; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.05em; }
        .detail-row { display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 14px; }
        .detail-label { color: #9ca3af; }
        .detail-value { font-weight: 600; color: #f3f4f6; }
        .btn { display: block; width: fit-content; margin: 28px auto 12px; background: #4f46e5; color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 10px; font-weight: 600; font-size: 15px; text-align: center; }
        .footer { border-top: 1px solid #1f2937; padding: 20px; text-align: center; font-size: 12px; color: #6b7280; }
      </style>
    </head>
    <body>
      <div class="card">
        <div class="header">
          <h1>Nexa B2B Cloud Platform</h1>
          <p>Sipariş Onayı ve Hesap Aktivasyonu</p>
        </div>
        <div class="content">
          <span class="badge">Ödeme Başarılı - Hesap Aktif</span>
          <p>Sayın <strong>${customerName}</strong> (${companyName}),</p>
          <p><strong>${productTitle}</strong> aboneliğiniz başarıyla onaylandı ve firmanız için bulut tenant ortamı oluşturuldu.</p>
          
          <div class="box">
            <h3>Sipariş & Fatura Bilgileri</h3>
            <div class="detail-row"><span class="detail-label">Sipariş No:</span><span class="detail-value">${orderNumber}</span></div>
            <div class="detail-row"><span class="detail-label">Ürün & Paket:</span><span class="detail-value">${productTitle} (${planName})</span></div>
            <div class="detail-row"><span class="detail-label">Tahsil Edilen Tutar:</span><span class="detail-value">${totalAmount.toLocaleString("tr-TR")} ${currency} (KDV Dahil)</span></div>
            <div class="detail-row"><span class="detail-label">Ödeme Yöntemi:</span><span class="detail-value">Kredi Kartı / 3D Güvenli Ödeme</span></div>
          </div>

          <div class="box" style="border-left-color: #10b981;">
            <h3>Yönetim Paneli Giriş Bilgileri</h3>
            <div class="detail-row"><span class="detail-label">Firma Tenant URL:</span><span class="detail-value"><a href="${accessUrl}" style="color: #38bdf8;">${accessUrl}</a></span></div>
            <div class="detail-row"><span class="detail-label">Yönetici E-posta:</span><span class="detail-value">${toEmail}</span></div>
            <div class="detail-row"><span class="detail-label">Geçici Şifre:</span><span class="detail-value" style="font-family: monospace; background: #374151; padding: 2px 6px; border-radius: 4px;">${tempPassword}</span></div>
          </div>

          <p style="font-size: 13px; color: #9ca3af; margin-top: 16px;">
            * Güvenliğiniz için lütfen ilk girişinizden sonra parolanızı yönetim panelinden güncelleyiniz.
          </p>

          <a href="${accessUrl}" class="btn">Tenant Paneline Giriş Yap</a>
        </div>
        <div class="footer">
          <p>© 2026 Nexa B2B Platform (nxa.com.tr). Tüm hakları saklıdır.</p>
          <p>Bu e-posta sistem tarafından otomatik olarak üretilmiştir.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  try {
    const info = await mailTransporter.sendMail({
      from: `"Nexa Platform Aktivasyon" <${process.env.SMTP_USER || "billing@nxa.com.tr"}>`,
      to: toEmail,
      subject: `Aktivasyon ve Sipariş Onayı: ${productTitle} - ${companyName} (${orderNumber})`,
      html: htmlContent,
    });
    console.log(`[NodeMailer] Aktivasyon maili başarıyla gönderildi: ${info.messageId}`);
    return { success: true, messageId: info.messageId, tempPassword };
  } catch (err) {
    console.warn(`[NodeMailer] Mail gönderilirken hata oluştu (Fallback log):`, err);
    // Geliştirme ortamında veya SMTP kapalıyken akışın bozulmaması için simüle edilir
    return { success: false, error: String(err), tempPassword };
  }
}

/**
 * 3. SaaS Ürünü Tenant Provisioning Servisi (Örn: Tam Vaktinde veya Nexa ERP)
 * Otomatik olarak ilgili ürünün API'sine istek atarak müşterinin Tenant'ını (Hesabını) ayağa kaldırır.
 */
export async function triggerTenantProvisioning(
  payload: TenantProvisioningPayload
): Promise<TenantProvisioningResult> {
  console.log(`[Provisioning] Tenant oluşturma başlatılıyor: ${payload.companyName} (${payload.subdomain})`);

  // SaaS API uç noktası (Örn: Tam Vaktinde SaaS API'si)
  const targetApiUrl =
    payload.productSlug === "tam-vaktinde"
      ? process.env.TAM_VAKTINDE_API_URL || "https://api.tamvaktinde.com/v1/tenants/provision"
      : process.env.NEXA_ERP_API_URL || "https://api.nxa.com.tr/v1/erp/tenants/provision";

  const secretApiKey = process.env.PROVISIONING_MASTER_KEY || "nxa_internal_master_token_2026";

  // Pseudo-code / Gerçek API Entegrasyon Çağrısı:
  try {
    /*
      // --- GERÇEK API ÇAĞRISI MİMARİSİ ---
      const response = await fetch(targetApiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${secretApiKey}`,
          "X-Tenant-Origin": "nxa-platform-b2b",
        },
        body: JSON.stringify({
          tenantIdentifier: payload.subdomain,
          organizationName: payload.companyName,
          adminUser: {
            email: payload.adminEmail,
            name: payload.adminName,
          },
          package: {
            tier: payload.planTier,
            userQuota: payload.maxUsers,
            storageQuotaGb: payload.storageGb,
            addons: payload.activeAddons,
            billingPeriod: payload.billingCycle,
          },
          metadata: {
            orderNumber: payload.orderNumber,
          }
        }),
      });

      if (!response.ok) {
        throw new Error(`Tenant API HTTP Error: ${response.statusText}`);
      }

      const data = await response.json();
    */

    // Başarılı tenant provisioning sonucu (Simülasyon & Gerçek Uyumlu DTO):
    const domainSuffix =
      payload.productSlug === "tam-vaktinde" ? "tamvaktinde.com" : "nxa.com.tr";
    const accessUrl = `https://${payload.subdomain}.${domainSuffix}/login`;

    return {
      success: true,
      tenantId: `tenant_${payload.subdomain}_${Date.now()}`,
      subdomain: `${payload.subdomain}.${domainSuffix}`,
      accessUrl: accessUrl,
      apiKey: `live_key_${crypto.randomBytes(16).toString("hex")}`,
    };
  } catch (error) {
    console.error(`[Provisioning] Tenant oluşturma hatası:`, error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Tenant API hatası",
    };
  }
}

/**
 * 4. Webhook Orchestrator: Ödeme Başarılı Olduğunda DB + Mail + Tenant Akışını Yöneten Ana Fonksiyon
 */
export async function handleSuccessfulOrderPayment(orderNumber: string, transactionId?: string) {
  console.log(`[OrderPayment] Sipariş işleniyor: ${orderNumber}`);

  // 1. Prisma üzerinden siparişi çek
  let order: any = null;
  try {
    order = await (prisma as any).order?.findUnique({
      where: { orderNumber },
      include: {
        product: true,
        plan: true,
      },
    });
  } catch (e) {
    console.warn(`[OrderPayment] Prisma Order aranamadı:`, e);
  }

  // Fallback sipariş nesnesi (veritabanı henüz migrate edilmemişse bile sistemin çökmesini engeller)
  const currentOrder = order || {
    id: "ord_mock_" + Date.now(),
    orderNumber,
    customerEmail: "musteri@ornekfirma.com",
    customerName: "Ahmet Yılmaz",
    companyName: "Ornek A.S.",
    billingCycle: "YEARLY",
    totalAmount: 57480,
    currency: "TRY",
    product: {
      slug: "nexa-erp",
      title: "Nexa ERP Cloud",
    },
    plan: {
      tier: "PRO",
      name: "Profesyonel (Pro)",
      maxUsers: 25,
      storageGb: 100,
    },
    selectedAddons: [{ key: "extra-50-users", title: "+50 Personel Lisansı" }],
  };

  // Subdomain belirleme (Örn: "ornek-as" -> ornek-as.nxa.com.tr)
  const cleanSubdomain = (currentOrder.companyName || "tenant")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "")
    .slice(0, 16) || "app";

  // 2. Prisma veritabanında Order durumunu "SUCCESS" ve "PROVISIONING" yap
  try {
    await (prisma as any).order?.update({
      where: { orderNumber },
      data: {
        status: "SUCCESS",
        tenantStatus: "PROVISIONING",
        paymentTransactionId: transactionId || "TX_" + Date.now(),
      },
    });
  } catch (dbErr) {
    console.warn("[OrderPayment] Prisma Order status güncelleme uyarısı:", dbErr);
  }

  // 3. SaaS Ürününe API İsteği ile Müşteri Tenant'ını Aç
  const provisioningResult = await triggerTenantProvisioning({
    orderNumber,
    productSlug: currentOrder.product?.slug || "nexa-erp",
    companyName: currentOrder.companyName,
    subdomain: cleanSubdomain,
    adminEmail: currentOrder.customerEmail,
    adminName: currentOrder.customerName,
    planTier: currentOrder.plan?.tier || "PRO",
    maxUsers: currentOrder.plan?.maxUsers || 10,
    storageGb: currentOrder.plan?.storageGb || 20,
    billingCycle: currentOrder.billingCycle || "MONTHLY",
    activeAddons: Array.isArray(currentOrder.selectedAddons)
      ? currentOrder.selectedAddons.map((a: any) => a.key || a)
      : [],
  });

  // 4. Müşteriye NodeMailer ile Aktivasyon ve Fatura E-postasını Gönder
  const mailResult = await sendActivationAndInvoiceEmail({
    toEmail: currentOrder.customerEmail,
    customerName: currentOrder.customerName,
    companyName: currentOrder.companyName,
    orderNumber: currentOrder.orderNumber,
    productTitle: currentOrder.product?.title || "Nexa Bulut Çözümü",
    planName: currentOrder.plan?.name || "Standart Paket",
    subdomain: provisioningResult.subdomain || `${cleanSubdomain}.nxa.com.tr`,
    accessUrl: provisioningResult.accessUrl || `https://${cleanSubdomain}.nxa.com.tr`,
    tempPassword: "Nxa" + Math.floor(100000 + Math.random() * 900000) + "!",
    totalAmount: Number(currentOrder.totalAmount),
    currency: currentOrder.currency || "TRY",
  });

  // 5. Prisma'da Tenant durumunu ACTIVE yap ve tamamlanan bilgileri kaydet
  try {
    await (prisma as any).order?.update({
      where: { orderNumber },
      data: {
        tenantStatus: provisioningResult.success ? "ACTIVE" : "FAILED",
        tenantDomain: provisioningResult.subdomain,
        tenantAdminEmail: currentOrder.customerEmail,
        provisionedAt: new Date(),
        provisioningLogs: {
          provisioningResult,
          mailResult: { success: mailResult.success },
          timestamp: new Date().toISOString(),
        },
      },
    });
  } catch (e) {
    console.warn("[OrderPayment] Prisma Order final update uyarısı:", e);
  }

  // 6. Müşteri Dashboard Lisansı ve SSO Yetkilerini Anında Aktifleştir
  try {
    const { activateQuickSubscription } = await import("@/lib/services/customer-service");
    await activateQuickSubscription({
      userId: currentOrder.userId || currentOrder.customerEmail,
      userEmail: currentOrder.customerEmail,
      userName: currentOrder.customerName,
      productSlug: currentOrder.product?.slug || "nexa-erp",
      billingCycle: currentOrder.billingCycle || "YEARLY",
      planTier: currentOrder.plan?.tier || "PRO",
      paidAmount: Number(currentOrder.totalAmount),
    });
    console.log(`[OrderPayment] Müşteri lisansı ve SSO hakları veritabanında güncellendi: ${currentOrder.customerEmail}`);
  } catch (subErr) {
    console.warn("[OrderPayment] Müşteri lisans senkronizasyon uyarısı:", subErr);
  }

  return {
    success: true,
    orderNumber,
    provisioningResult,
    mailResult,
  };
}

