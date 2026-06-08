export type ProductType = "saas" | "service";

export type BillingCycle = "monthly" | "yearly" | "one_time";

export interface ProductPricing {
  monthly?: number;
  yearly?: number;
  oneTime?: number;
  currency: "TRY" | "USD" | "EUR";
}

export interface ProductUsageQuotas {
  maxUsers?: number;
  maxTransactions?: number;
}

export interface IProduct {
  _id: string;
  title: string;
  slug: string;
  description: string;
  type: ProductType;
  businessId: string;
  /** SaaS için panel URL (SSO yönlendirmesi) */
  panelUrl?: string;
  features?: string[];
  pricing: ProductPricing;
  /** Geriye dönük uyumluluk — yeni kayıtlarda pricing kullanılır */
  price?: number;
  discountPrice?: number;
  durationDays?: number;
  salesCount?: number;
  requiredFields?: string[];
  usageQuotas?: ProductUsageQuotas;
  isActive?: boolean;
  sortOrder?: number;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface IProductDocument extends Omit<IProduct, "_id"> {}
