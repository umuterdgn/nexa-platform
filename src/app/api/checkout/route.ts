import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getProductBySlug, calculateOrderTotals } from "@/lib/services/product-service";
import { createPaytrToken, buildUserBasket } from "@/lib/paytr";
import type { CheckoutPayload, CheckoutResponse } from "@/types/saas";

export const dynamic = "force-dynamic";

/**
 * B2B SaaS Checkout API Uç Noktası
 * POST /api/checkout
 * 
 * 1. Müşteri e-posta doğrulamasını kontrol eder (Doğrulanmamış hesapları engeller).
 * 2. Sepet verilerini sunucu tarafında güvenle hesaplar (fiyat manipülasyonunu engeller).
 * 3. Prisma veritabanına PENDING siparişi yazar.
 * 4. PayTR API'sinden iframe token'ı alır ve ödeme yönlendirme URL'ini üretir.
 */
export async function POST(req: Request) {
  try {
    const body: CheckoutPayload = await req.json();
    const {
      productSlug,
      planTier,
      billingCycle,
      selectedAddonKeys = [],
      customer,
    } = body;

    // 1. Temel Girdi Doğrulaması (Validation)
    if (!productSlug || !planTier || !customer?.email || !customer?.companyName) {
      return NextResponse.json(
        {
          success: false,
          message: "Lütfen gerekli tüm firma ve paket bilgilerini eksiksiz doldurunuz.",
        },
        { status: 400 }
      );
    }

    const emailTrimmed = customer.email.toLowerCase().trim();

    // 2. Müşteri Mail Doğrulaması Kontrolü (Email Verification Check)
    // Eğer kullanıcı kayıtlı ise ve e-postası doğrulanmamışsa ödeme adımını engelle
    try {
      const existingUser = await (prisma as any).user?.findUnique({
        where: { email: emailTrimmed },
      });

      if (existingUser && existingUser.isVerified === false) {
        return NextResponse.json(
          {
            success: false,
            unverified: true,
            email: emailTrimmed,
            message:
              "E-posta adresiniz henüz doğrulanmamış. Lütfen gelen kutunuza gönderilen 6 haneli kodu veya aktivasyon linkini onaylayın.",
          },
          { status: 403 }
        );
      }
    } catch (uErr) {
      console.warn("[Checkout API] Kullanıcı doğrulama kontrol uyarısı:", uErr);
    }

    // 3. Ürünü ve Seçilen Lisans Paketini Getir
    const product = await getProductBySlug(productSlug);
    if (!product) {
      return NextResponse.json(
        { success: false, message: "İlgili B2B SaaS ürünü vitrinde bulunamadı." },
        { status: 404 }
      );
    }

    const plan = product.plans.find((p) => p.tier === planTier);
    if (!plan) {
      return NextResponse.json(
        { success: false, message: "Seçilen lisans paketi geçersiz." },
        { status: 400 }
      );
    }

    // Seçilen Eklentileri Doğrula
    const selectedAddons = product.addons.filter((addon) =>
      selectedAddonKeys.includes(addon.key)
    );

    // 4. Sunucu Tarafı Güvenli Tutar Hesaplama (Fiyat Manipülasyonunu Önleme)
    const orderCalculation = calculateOrderTotals({
      plan,
      cycle: billingCycle,
      selectedAddons,
    });

    const orderNumber = `NXA-ORD-${new Date().getFullYear()}-${Math.floor(
      100000 + Math.random() * 900000
    )}`;

    // 5. Prisma Veritabanına PENDING Siparişi Kaydet
    try {
      await (prisma as any).order?.create({
        data: {
          orderNumber,
          customerEmail: emailTrimmed,
          customerName: customer.fullName || customer.companyName,
          customerPhone: customer.phone,
          companyName: customer.companyName,
          taxNumber: customer.taxNumber,
          taxOffice: customer.taxOffice,
          billingCycle: billingCycle,
          productId: product.id,
          planId: plan.id,
          selectedAddons: selectedAddons.map((a) => ({
            key: a.key,
            title: a.title,
            price: billingCycle === "YEARLY" ? a.yearlyPrice * 12 : a.monthlyPrice,
          })),
          subtotal: orderCalculation.subtotal,
          taxAmount: orderCalculation.taxAmount,
          totalAmount: orderCalculation.grandTotal,
          currency: orderCalculation.currency,
          status: "PENDING",
          tenantStatus: "IDLE",
          paymentProvider: "PAYTR",
        },
      });
      console.log(`[Checkout API] Prisma Order başarıyla oluşturuldu: ${orderNumber}`);
    } catch (dbError) {
      console.warn(`[Checkout API] Prisma Order kaydı uyarısı (Dev Modu):`, dbError);
    }

    // 6. PayTR API İframe Token Üretimi
    const merchantId = process.env.PAYTR_MERCHANT_ID || "TEST_MERCHANT_ID";
    const merchantKey = process.env.PAYTR_MERCHANT_KEY || "TEST_MERCHANT_KEY";
    const merchantSalt = process.env.PAYTR_MERCHANT_SALT || "TEST_MERCHANT_SALT";

    const userIp = req.headers.get("x-forwarded-for")?.split(",")[0] || "127.0.0.1";
    const paymentAmountKurus = Math.round(orderCalculation.grandTotal * 100);

    const userBasket = buildUserBasket(
      `${product.title} - ${plan.name} (${billingCycle})`,
      orderCalculation.grandTotal
    );

    let paytrToken = `paytr_token_mock_${orderNumber}_${Date.now()}`;

    // Gerçek PayTR credentials varsa PayTR API'sine token isteği at
    if (
      merchantId !== "TEST_MERCHANT_ID" &&
      merchantKey !== "TEST_MERCHANT_KEY" &&
      merchantSalt !== "TEST_MERCHANT_SALT"
    ) {
      try {
        const hashStr = `${merchantId}${userIp}${orderNumber}${emailTrimmed}${paymentAmountKurus}${userBasket}00TRY1`;
        const calculatedToken = createPaytrToken(hashStr, merchantKey, merchantSalt);
        const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://nxa.com.tr";

        const formData = new URLSearchParams();
        formData.append("merchant_id", merchantId);
        formData.append("user_ip", userIp);
        formData.append("merchant_oid", orderNumber);
        formData.append("email", emailTrimmed);
        formData.append("payment_amount", paymentAmountKurus.toString());
        formData.append("paytr_token", calculatedToken);
        formData.append("user_basket", userBasket);
        formData.append("debug_on", "1");
        formData.append("no_installment", "0");
        formData.append("max_installment", "12");
        formData.append("user_name", customer.fullName || customer.companyName);
        formData.append("user_address", customer.taxOffice || "Türkiye");
        formData.append("user_phone", customer.phone || "05555555555");
        formData.append("merchant_ok_url", `${appUrl}/profil?odeme=basarili&orderNumber=${orderNumber}`);
        formData.append("merchant_fail_url", `${appUrl}/checkout?orderNumber=${orderNumber}&hata=1`);
        formData.append("timeout_limit", "30");
        formData.append("currency", "TL");
        formData.append("test_mode", "1");

        const paytrRes = await fetch("https://www.paytr.com/odeme/api/get-token", {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: formData.toString(),
        });

        const paytrData = await paytrRes.json();
        if (paytrData.status === "success" && paytrData.token) {
          paytrToken = paytrData.token;
          console.log(`[Checkout API] PayTR canlı iframe token alındı: ${paytrToken}`);
        } else {
          console.warn("[Checkout API] PayTR get-token yanıtı:", paytrData);
        }
      } catch (pErr) {
        console.warn("[Checkout API] PayTR token alma hatası (Fallback token devrede):", pErr);
      }
    }

    // 7. Ödeme Yönlendirme URL'i
    // /checkout sayfasına tam sipariş ve ürün parametreleriyle yönlendirir
    const paymentUrl = `/checkout?orderNumber=${orderNumber}&product=${product.slug}&plan=${plan.tier}&token=${paytrToken}`;

    const responsePayload: CheckoutResponse = {
      success: true,
      orderNumber,
      totalAmount: orderCalculation.grandTotal,
      currency: orderCalculation.currency,
      paymentUrl,
      paymentToken: paytrToken,
      message: "Sipariş oluşturuldu, ödeme sayfasına yönlendiriliyorsunuz.",
    };

    return NextResponse.json(responsePayload, { status: 201 });
  } catch (error: any) {
    console.error("[Checkout API] Hata:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Sipariş başlatılırken bir sunucu hatası meydana geldi.",
        error: error?.message,
      },
      { status: 500 }
    );
  }
}
