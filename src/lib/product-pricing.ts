import type { BillingCycle, IProduct, ProductPricing } from "@/types/product";

type ProductLike = Pick<
  Partial<IProduct>,
  "type" | "price" | "discountPrice" | "pricing" | "durationDays"
>;

export function getEffectivePrice(
  product: ProductLike,
  cycle: BillingCycle = "monthly",
): number {
  const pricing = product.pricing;

  if (pricing) {
    const fromPricing = resolvePriceFromPricing(pricing, cycle, product.type);
    if (fromPricing != null) return fromPricing;
  }

  const base = product.price ?? 0;
  if (
    product.discountPrice != null &&
    product.discountPrice > 0 &&
    product.discountPrice < base
  ) {
    return product.discountPrice;
  }
  return base;
}

function resolvePriceFromPricing(
  pricing: ProductPricing,
  cycle: BillingCycle,
  type?: IProduct["type"],
): number | null {
  if (cycle === "monthly" && pricing.monthly != null) return pricing.monthly;
  if (cycle === "yearly" && pricing.yearly != null) return pricing.yearly;
  if (cycle === "one_time" && pricing.oneTime != null) return pricing.oneTime;

  if (type === "service" && pricing.oneTime != null) return pricing.oneTime;
  if (pricing.monthly != null) return pricing.monthly;
  if (pricing.yearly != null) return pricing.yearly;
  if (pricing.oneTime != null) return pricing.oneTime;

  return null;
}

export function getDefaultBillingCycle(product: ProductLike): BillingCycle {
  if (product.type === "service") return "one_time";
  if (product.pricing?.yearly != null && product.pricing.monthly == null) {
    return "yearly";
  }
  return "monthly";
}

export function getDurationDaysForCycle(
  product: ProductLike,
  cycle: BillingCycle,
): number {
  if (product.type === "service") return product.durationDays ?? 0;
  if (product.durationDays && product.durationDays > 0) {
    return product.durationDays;
  }
  if (cycle === "yearly") return 365;
  if (cycle === "monthly") return 30;
  return 30;
}

export function getCycleLabel(
  cycle: BillingCycle,
  type?: IProduct["type"],
): string {
  if (cycle === "yearly") return "/yıllık";
  if (cycle === "one_time") return type === "service" ? "/proje" : "";
  return "/aylık";
}

export function buildPricingFromLegacy(input: {
  price?: number;
  discountPrice?: number;
  type?: IProduct["type"];
  pricing?: Partial<ProductPricing>;
}): ProductPricing {
  const effective =
    input.discountPrice != null &&
    input.discountPrice > 0 &&
    input.price != null &&
    input.discountPrice < input.price
      ? input.discountPrice
      : (input.price ?? 0);

  const base: ProductPricing = {
    currency: input.pricing?.currency ?? "TRY",
    ...input.pricing,
  };

  if (input.type === "service") {
    base.oneTime = base.oneTime ?? effective;
  } else {
    base.monthly = base.monthly ?? effective;
  }

  return base;
}
