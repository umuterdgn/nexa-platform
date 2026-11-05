import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getProductBySlug } from "@/lib/services/product-service";
import { PaytrCheckoutView } from "./PaytrCheckoutView";
import { Sparkles, ArrowLeft } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Güvenli Ödeme & 3D Secure | Nexa Checkout",
  description:
    "PayTR 256-bit SSL şifreli güvenli ödeme sayfası. Lisans aktivasyonu ve anında SSO yetkilendirmesi.",
};

interface Props {
  searchParams: Promise<{
    orderNumber?: string;
    product?: string;
    plan?: string;
    total?: string;
    token?: string;
  }>;
}

export default async function CheckoutPage({ searchParams }: Props) {
  const { orderNumber, product: productSlug, plan: planTier, token } = await searchParams;

  let orderData: any = null;

  // 1. Prisma'dan Mevcut Siparişi Getir (Eğer orderNumber varsa)
  if (orderNumber) {
    try {
      orderData = await (prisma as any).order?.findUnique({
        where: { orderNumber },
        include: {
          product: true,
          plan: true,
        },
      });
    } catch (err) {
      console.warn("[Checkout Page] Prisma sipariş arama uyarısı:", err);
    }
  }

  // 2. Ürün ve Plan Detaylarını Çözümle
  const slug = orderData?.product?.slug || productSlug || "nexa-custom";
  const product = await getProductBySlug(slug);

  const fallbackProduct = product || {
    id: "prod-default",
    slug: "nexa-custom",
    title: "Nexa Custom: Kurumsal Özel SaaS & Mimari",
    description: "Kuruma özel yazılım ve IoT mimarisi.",
    ssoUrl: "https://nxa.com.tr/profil",
    plans: [
      {
        id: "plan-default",
        tier: "PRO",
        name: "Kurumsal Mimari (Pro)",
        monthlyPrice: 6990,
        yearlyPrice: 5590,
        currency: "TRY",
      },
    ],
  };

  const selectedTier = orderData?.plan?.tier || planTier || "PRO";
  const activePlan =
    fallbackProduct.plans.find((p) => p.tier === selectedTier) ||
    fallbackProduct.plans[0];

  const effectiveOrderNumber =
    orderData?.orderNumber ||
    orderNumber ||
    `NXA-ORD-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;

  const totalAmount = orderData
    ? Number(orderData.totalAmount)
    : activePlan.yearlyPrice * 12 * 1.2; // KDV dahil yıllık peşin

  const paytrToken =
    token ||
    `paytr_token_mock_${effectiveOrderNumber}_${Date.now()}`;

  const ssoUrl =
    orderData?.product?.ssoUrl ||
    fallbackProduct.ssoUrl ||
    "https://nxa.com.tr/profil";

  return (
    <div className="relative min-h-screen bg-slate-950 text-slate-100 selection:bg-cyan-500/30 selection:text-cyan-200 pt-28 pb-20 px-4 sm:px-6 lg:px-8">
      {/* Background Ambient Glow */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-1/2 -translate-x-1/2 h-[500px] w-[800px] rounded-full bg-cyan-600/10 blur-[140px]" />
        <div className="absolute top-1/2 right-10 h-[400px] w-[500px] rounded-full bg-blue-600/10 blur-[130px]" />
      </div>

      <div className="relative mx-auto max-w-6xl">
        {/* Breadcrumb / Back Link */}
        <div className="mb-8 flex items-center justify-between">
          <Link
            href={`/urunler/${slug}`}
            className="inline-flex items-center gap-2 text-xs font-mono text-slate-400 hover:text-cyan-300 transition"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Ürün Sayfasına Geri Dön</span>
          </Link>

          <span className="inline-flex items-center gap-1.5 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-1 text-xs font-mono font-medium text-cyan-400">
            <Sparkles className="h-3 w-3" />
            PayTR 3D Secure Doğrulama
          </span>
        </div>

        {/* PayTR Checkout Görünümü */}
        <PaytrCheckoutView
          orderNumber={effectiveOrderNumber}
          productSlug={slug}
          productTitle={orderData?.product?.title || fallbackProduct.title}
          planName={orderData?.plan?.name || activePlan.name}
          billingCycle={orderData?.billingCycle || "YEARLY"}
          totalAmount={Math.round(totalAmount)}
          currency="TRY"
          customerName={orderData?.customerName || "Nexa Müşterisi"}
          customerEmail={orderData?.customerEmail || "yonetici@kurumunuz.com"}
          companyName={orderData?.companyName || "Kurumsal Firma"}
          initialStatus={orderData?.status || "PENDING"}
          paytrToken={paytrToken}
          ssoUrl={ssoUrl}
          isUserVerified={true}
        />
      </div>
    </div>
  );
}
