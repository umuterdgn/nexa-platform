import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getProductBySlug, DEFAULT_SAAS_CATALOG } from "@/lib/services/product-service";
import { activateQuickSubscription } from "@/lib/services/customer-service";
import { sendActivationAndInvoiceEmail } from "@/lib/services/provisioning-service";

/**
 * Müşteri Portalı İçi Hızlı Satın Alma & Anında Lisans Aktivasyonu
 * POST /api/dashboard/quick-checkout
 * 
 * Müşteri panelinden ayrılmadan yeni ürün veya jeton (Örn: Ek 5 AI Görsel Jetonu, Tam Vaktinde vb.)
 * satın almak istediğinde doğrudan çalışır; anında veritabanında lisans ve SSO haklarını günceller.
 */
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id || !session?.user?.email) {
      return NextResponse.json(
        { success: false, message: "Satın alma için lütfen giriş yapınız." },
        { status: 401 }
      );
    }

    const body = await req.json();
    const {
      productSlug,
      billingCycle = "YEARLY",
      planTier = "PRO",
    } = body;

    if (!productSlug) {
      return NextResponse.json(
        { success: false, message: "Lütfen satın almak istediğiniz ürünü seçiniz." },
        { status: 400 }
      );
    }

    const product = (await getProductBySlug(productSlug)) || DEFAULT_SAAS_CATALOG[productSlug];
    if (!product) {
      return NextResponse.json(
        { success: false, message: "Seçilen ürün katalogda bulunamadı." },
        { status: 404 }
      );
    }

    const plan = product.plans.find((p) => p.tier === planTier) || product.plans[0];
    const isYearly = billingCycle === "YEARLY";
    const basePrice = isYearly ? plan.yearlyPrice * 12 : plan.monthlyPrice;
    const totalWithKdv = Math.round(basePrice * 1.2);

    // Lisansı ve SSO Haklarını Veritabanında Anında Aktifleştir
    const activationResult = await activateQuickSubscription({
      userId: session.user.id,
      userEmail: session.user.email,
      userName: session.user.name || undefined,
      productSlug: product.slug,
      billingCycle: isYearly ? "YEARLY" : "MONTHLY",
      planTier: plan.tier,
      paidAmount: totalWithKdv,
    });

    // Müşteriye Otomatik e-Fatura ve Aktivasyon E-postası Gönder
    try {
      await sendActivationAndInvoiceEmail({
        toEmail: session.user.email,
        customerName: session.user.name || "Değerli Müşterimiz",
        companyName: (session.user as any).companyName || "Nexa Kurumsal Müşterisi",
        orderNumber: activationResult.subscription.orderNumber || `NXA-ORD-${Date.now()}`,
        productTitle: product.title,
        planName: activationResult.subscription.planName,
        subdomain: product.slug,
        accessUrl: `https://nxa.com.tr${activationResult.subscription.ssoUrl}`,
        totalAmount: totalWithKdv,
        currency: "TRY",
      });
    } catch (mailErr) {
      console.warn("[QuickCheckout] Mail gönderim uyarısı:", mailErr);
    }

    return NextResponse.json({
      success: true,
      message: `${product.title} başarıyla hesabınıza tanımlandı ve SSO yetkileriniz aktif edildi!`,
      subscription: activationResult.subscription,
      ssoUrl: activationResult.subscription.ssoUrl,
      orderNumber: activationResult.subscription.orderNumber,
      invoiceNumber: activationResult.subscription.invoiceNumber,
    });
  } catch (error: any) {
    console.error("[QuickCheckout] Hata:", error);
    return NextResponse.json(
      {
        success: false,
        message: error?.message || "Satın alma işlemi sırasında bir hata oluştu.",
      },
      { status: 500 }
    );
  }
}

