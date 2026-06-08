import Link from "next/link";
import { connectMongoDB } from "@/lib/mongodb";
import { Product } from "@/models/Product";
import {
  getDefaultBillingCycle,
  getEffectivePrice,
  getListPrice,
  getCycleLabel,
  hasDiscount,
} from "@/lib/product-pricing";
import type { IProduct } from "@/types/product";

export const dynamic = "force-dynamic";

type LeanProduct = IProduct & { _id: { toString(): string } };

function ProductCard({
  product,
  variant,
}: {
  product: LeanProduct;
  variant: "saas" | "service";
}) {
  const productId = product._id.toString();
  const cycle = getDefaultBillingCycle(product);
  const displayPrice = getEffectivePrice(product, cycle);
  const listPrice = getListPrice(product, cycle);
  const showDiscount = hasDiscount(product, cycle);
  const cycleLabel = getCycleLabel(cycle, product.type);
  const features = product.features ?? [];

  const accent =
    variant === "saas"
      ? {
          border: "hover:border-nexa-electric/40 hover:shadow-nexa-electric/5",
          titleHover: "group-hover:text-nexa-neon",
          icon: "text-nexa-electric-bright",
          btn: "bg-nexa-electric hover:bg-nexa-electric-bright shadow-neon-sm",
        }
      : {
          border: "hover:border-purple-500/40 hover:shadow-purple-500/5",
          titleHover: "group-hover:text-purple-400",
          icon: "text-purple-400",
          btn: "bg-purple-600 hover:bg-purple-500 shadow-md",
        };

  return (
    <div
      className={`flex flex-col justify-between rounded-2xl border border-white/10 bg-gradient-to-b from-nexa-anthracite/40 to-black p-6 shadow-2xl transition-all duration-300 group ${accent.border}`}
    >
      <div>
        <h3
          className={`font-display text-xl font-semibold text-white transition-colors ${accent.titleHover}`}
        >
          {product.title}
        </h3>

        <div className="mt-4 flex items-baseline text-white">
          {showDiscount ? (
            <div className="flex flex-col">
              <span className="text-xs text-slate-500 line-through font-mono">
                ₺{listPrice.toLocaleString("tr-TR")}
              </span>
              <div className="flex items-baseline">
                <span className="text-3xl font-bold tracking-tight text-emerald-400">
                  ₺{displayPrice.toLocaleString("tr-TR")}
                </span>
                {cycleLabel && (
                  <span className="ml-1 text-sm font-semibold text-slate-400">
                    {cycleLabel}
                  </span>
                )}
              </div>
            </div>
          ) : (
            <>
              <span className="text-3xl font-bold tracking-tight">
                ₺{displayPrice.toLocaleString("tr-TR")}
              </span>
              {cycleLabel && (
                <span className="ml-1 text-sm font-semibold text-slate-400">
                  {cycleLabel}
                </span>
              )}
            </>
          )}
        </div>

        {variant === "saas" && product.pricing?.yearly != null && cycle === "monthly" && (
          <p className="mt-1 text-xs text-slate-500">
            Yıllık: ₺{product.pricing.yearly.toLocaleString("tr-TR")}
          </p>
        )}

        <p className="mt-4 text-sm text-slate-400 leading-relaxed line-clamp-3 min-h-[60px]">
          {product.description}
        </p>

        {features.length > 0 && (
          <ul className="mt-6 space-y-3 border-t border-white/5 pt-6 text-sm text-slate-300">
            {features.map((feature, idx) => (
              <li key={idx} className="flex items-center gap-2.5">
                <svg
                  className={`h-4 w-4 flex-shrink-0 ${accent.icon}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="3"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span className="line-clamp-1">{feature}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="mt-8">
        <Link
          href={`/checkout/${productId}`}
          className={`block w-full rounded-xl px-4 py-3 text-center text-sm font-semibold text-white transition-all active:scale-[0.98] ${accent.btn}`}
        >
          Hemen Başla
        </Link>
      </div>
    </div>
  );
}

export default async function UrunlerPage() {
  let products: LeanProduct[] = [];

  try {
    await connectMongoDB();
    const _force = Product.modelName;

    products = (await Product.find({ isActive: { $ne: false } })
      .sort({ sortOrder: 1, createdAt: -1 })
      .lean()) as unknown as LeanProduct[];
  } catch (error) {
    console.error("Ürünler çekilirken DB hatası oluştu:", error);
  }

  const saasProducts = products.filter((p) => p.type === "saas");
  const serviceProducts = products.filter((p) => p.type === "service");
  const isEmpty = products.length === 0;

  return (
    <div className="bg-black text-foreground selection:bg-nexa-electric/30">
      <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:py-32">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-nexa-electric-bright">
            Nexa Çözümleri
          </p>
          <h1 className="mt-4 font-display text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
            İşinizi büyüten{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-nexa-electric-bright to-purple-400">
              Nexa ürünleri
            </span>
          </h1>
          <p className="mt-6 text-lg text-slate-400">
            SaaS paketleri ve ajans hizmetleri — veritabanından anlık ve dinamik
            listelenir.
          </p>
        </div>

        {isEmpty ? (
          <div className="rounded-2xl border border-dashed border-white/15 bg-slate-900/40 p-12 text-center max-w-md mx-auto">
            <p className="text-slate-400">Henüz vitrinde ürün bulunmuyor.</p>
          </div>
        ) : (
          <div className="space-y-20">
            {saasProducts.length > 0 && (
              <div>
                <h2 className="mb-8 font-display text-2xl font-semibold text-white border-l-2 border-nexa-electric pl-3">
                  SaaS Paketleri
                </h2>
                <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 items-stretch">
                  {saasProducts.map((product) => (
                    <ProductCard
                      key={product._id.toString()}
                      product={product}
                      variant="saas"
                    />
                  ))}
                </div>
              </div>
            )}

            {serviceProducts.length > 0 && (
              <div>
                <h2 className="mb-8 font-display text-2xl font-semibold text-white border-l-2 border-purple-500 pl-3">
                  Ajans Hizmetleri
                </h2>
                <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 items-stretch">
                  {serviceProducts.map((product) => (
                    <ProductCard
                      key={product._id.toString()}
                      product={product}
                      variant="service"
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        <p className="mt-24 text-center text-sm text-slate-500">
          Fiyatlar KDV hariç gösterilir. Ödeme adımında KDV eklenir.
        </p>
      </div>
    </div>
  );
}
