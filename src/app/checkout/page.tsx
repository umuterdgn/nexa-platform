import { connectMongoDB } from "@/lib/mongodb";
import { Product } from "@/models/Product";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function CheckoutRedirectPage({
  searchParams,
}: {
  searchParams: Promise<{ product?: string; plan?: string }>;
}) {
  const { product: productSlug, plan } = await searchParams;

  if (!productSlug) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-black text-white">
        <h1 className="mb-4 font-display text-3xl font-bold text-red-500">
          Ürün Bulunamadı
        </h1>
        <p className="text-slate-400">
          Lütfen geçerli bir ürün seçin.
        </p>
      </div>
    );
  }

  await connectMongoDB();
  const _force = Product.modelName;

  const product = await Product.findOne({ slug: productSlug }).lean();

  if (!product) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-black text-white">
        <h1 className="mb-4 font-display text-3xl font-bold text-red-500">
          Ürün Bulunamadı
        </h1>
        <p className="text-slate-400">
          "{productSlug}" ürünü sistemde kayıtlı değil.
        </p>
      </div>
    );
  }

  const productId = product._id.toString();
  const planParam = plan ? `?plan=${plan}` : "";
  
  redirect(`/checkout/${productId}${planParam}`);
}
