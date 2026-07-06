import { connectMongoDB } from "@/lib/mongodb";
import { Product } from "@/models/Product";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { CheckoutClient } from "./CheckoutClient";
import { Navbar } from "@/components/layout/Navbar";
import {
  getDefaultBillingCycle,
  getEffectivePrice,
} from "@/lib/product-pricing";

export const dynamic = "force-dynamic";

export default async function CheckoutPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ plan?: string }>;
}) {
  const resolvedParams = await params;
  const productId = resolvedParams.id;
  const { plan } = await searchParams;

  const session = await getServerSession(authOptions);
  if (!session?.user) {
    redirect(`/auth/login?callbackUrl=/checkout/${productId}${plan ? `?plan=${plan}` : ""}`);
  }

  await connectMongoDB();
  const _force = Product.modelName;

  let product = null;
  try {
    product = await Product.findById(productId).lean();
  } catch (error) {
    console.error("ID formatı geçersiz:", error);
  }

  if (!product) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-black text-white">
        <h1 className="mb-4 font-display text-3xl font-bold text-red-500">
          Ürün Bulunamadı
        </h1>
        <p className="text-slate-400">
          Aradığınız ürün yayından kaldırılmış veya URL hatalı olabilir.
        </p>
      </div>
    );
  }

  const billingCycle = getDefaultBillingCycle(product);
  const activePrice = getEffectivePrice(product, billingCycle);

  const serializedProduct = {
    id: product._id.toString(),
    title: product.title,
    description: product.description,
    type: product.type,
    activePrice,
    billingCycle,
    pricing: product.pricing,
    plan,
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      <div className="flex items-center justify-center p-8 pt-32 lg:p-24 lg:pt-40">
        <CheckoutClient product={serializedProduct} />
      </div>
    </div>
  );
}
