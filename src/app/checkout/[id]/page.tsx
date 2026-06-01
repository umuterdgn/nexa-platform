import { notFound } from "next/navigation";
import { connectMongoDB } from "@/lib/mongodb";
import { Product } from "@/models/Product";
import { CheckoutClient } from "@/components/checkout/CheckoutClient";
import type { ProductCardData } from "@/types/product-card";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function CheckoutPage({ params }: PageProps) {
  const { id } = await params;

  await connectMongoDB();
  const doc = await Product.findOne({ slug: id, type: "saas" }).lean();

  if (!doc) notFound();

  const product: ProductCardData = {
    slug: doc.slug,
    title: doc.title,
    description: doc.description,
    price: doc.price,
    features: doc.features ?? [],
    type: doc.type,
  };

  return <CheckoutClient product={product} />;
}
