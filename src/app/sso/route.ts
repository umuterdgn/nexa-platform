import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { connectMongoDB } from "@/lib/mongodb";
import { Subscription as MongoSubscription } from "@/models/Subscription";
import { Product as MongoProduct } from "@/models/Product";
import { getProductBySlug, DEFAULT_SAAS_CATALOG } from "@/lib/services/product-service";
import jwt from "jsonwebtoken";

/**
 * Dinamik Single Sign-On (SSO) Yönlendirme Uç Noktası
 * GET /sso?slug=tam-vaktinde (veya /sso?slug=ai_token_5 veya /sso?subId=...)
 * 
 * 1. Oturumu (NextAuth JWT) doğrular.
 * 2. İlgili ürünün benzersiz slug'ını ve veritabanındaki "Yönetim Paneli SSO URL" değerini çözer.
 * 3. Kriptografik güvenli JWT bileti (token) imzalar.
 * 4. Müşteriyi doğrudan ilgili ürünün SSO paneline giriş yapmış olarak yönlendirir.
 */
export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const slugParam = url.searchParams.get("slug") || url.searchParams.get("productSlug");
    const subIdParam = url.searchParams.get("subId");

    // 1. Kullanıcı Giriş Kontrolü
    const session = await getServerSession(authOptions);
    if (!session?.user?.email || !session.user.id) {
      const returnUrl = encodeURIComponent(req.url);
      return NextResponse.redirect(new URL(`/auth/login?callbackUrl=${returnUrl}`, req.url), 302);
    }

    // E-Posta Doğrulama Kontrolü (Doğrulanmamış hesaplar SSO paneline geçemez)
    try {
      const pUser = await (prisma as any).user?.findUnique({
        where: { email: session.user.email.toLowerCase().trim() },
      });
      if (pUser && pUser.isVerified === false) {
        return NextResponse.redirect(
          new URL(
            `/auth/verify?email=${encodeURIComponent(session.user.email)}&error=unverified`,
            req.url
          ),
          302
        );
      }
    } catch (e) {
      // Devam et
    }

    if (!slugParam && !subIdParam) {
      return NextResponse.redirect(new URL("/profil?error=eksik-parametre", req.url), 302);
    }

    let targetSlug = slugParam || "";
    let planType = "Standart Plan";
    let targetSsoUrl = "";

    // 2. subId parametresi varsa veritabanından slug ve lisans bilgisini doğrula
    if (subIdParam && !targetSlug) {
      // Prisma kontrolü
      try {
        const pSub = await (prisma as any).subscription?.findUnique({
          where: { id: subIdParam },
          include: { product: true },
        });
        if (pSub?.product?.slug) {
          targetSlug = pSub.product.slug;
          planType = pSub.planType || "Pro Yıllık Plan";
          targetSsoUrl = pSub.product.ssoUrl || pSub.product.panelUrl || "";
        }
      } catch (err) {
        // Devam et
      }

      // MongoDB kontrolü
      if (!targetSlug) {
        try {
          await connectMongoDB();
          const _force = MongoProduct.modelName;
          const mSub = await MongoSubscription.findById(subIdParam).populate("productId");
          if (mSub && (mSub as any).productId) {
            const mProd = (mSub as any).productId;
            targetSlug = mProd.slug;
            planType = mSub.planType || "Pro Yıllık Plan";
            targetSsoUrl = mProd.ssoUrl || mProd.panelUrl || "";
          }
        } catch (err) {
          // Devam et
        }
      }
    }

    // 3. Ürün Bilgisini ve "Yönetim Paneli SSO URL" Değerini Çöz
    const product = (targetSlug ? await getProductBySlug(targetSlug) : null) || DEFAULT_SAAS_CATALOG[targetSlug];

    if (!product && !targetSsoUrl) {
      console.warn(`[SSO] Ürün bulunamadı: ${targetSlug || subIdParam}`);
      return NextResponse.redirect(new URL("/profil?error=urun-bulunamadi", req.url), 302);
    }

    // SSO URL Önceliği: Veritabanı / Katalog ssoUrl -> panelUrl -> Varsayılan şablon
    if (!targetSsoUrl) {
      targetSsoUrl = product?.ssoUrl || (product as any)?.panelUrl || "";
    }

    if (!targetSsoUrl) {
      if (targetSlug === "tam-vaktinde") {
        targetSsoUrl = "https://tamvaktinde.com.tr/auth/sso";
      } else if (targetSlug === "ai_token_5") {
        targetSsoUrl = "https://tamvaktinde.com.tr/auth/sso?module=ai_visual";
      } else {
        targetSsoUrl = `https://${targetSlug}.nxa.com.tr/auth/sso`;
      }
    }

    // 4. Şifreli SSO Biletini (JWT) Üret
    const ssoPayload = {
      nexaUserId: session.user.id,
      email: session.user.email,
      name: session.user.name || session.user.email,
      productSlug: targetSlug || product?.slug,
      productTitle: product?.title || targetSlug,
      planType: planType,
      role: session.user.role || "customer",
      timestamp: Date.now(),
      iss: "https://nxa.com.tr",
      aud: targetSsoUrl,
      exp: Math.floor(Date.now() / 1000) + 60 * 5, // 5 dakika geçerli bilet
    };

    const secretKey = process.env.SSO_SECRET_KEY || "nexa-cok-gizli-sso-anahtari-2026";
    const ssoToken = jwt.sign(ssoPayload, secretKey);

    // 5. Hedef SSO Adresine Token'ı Ekleyerek Müşteriyi Yönlendir
    const delimiter = targetSsoUrl.includes("?") ? "&" : "?";
    const finalRedirectUrl = `${targetSsoUrl}${delimiter}token=${encodeURIComponent(ssoToken)}`;

    console.log(
      `[SSO Redirect] Kullanıcı: ${session.user.email} -> Ürün: ${targetSlug} -> Hedef: ${finalRedirectUrl.slice(0, 80)}...`
    );

    return NextResponse.redirect(finalRedirectUrl, 302);
  } catch (error: any) {
    console.error("[SSO] Kritik Yönlendirme Hatası:", error);
    return NextResponse.redirect(new URL("/profil?error=sso-yonlendirme-hatasi", req.url), 302);
  }
}
