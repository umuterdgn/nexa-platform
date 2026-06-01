export type ProductType = "saas" | "service";

export type BillingCycle = "monthly" | "yearly" | "one_time";

export interface IProduct {
  _id: string;
  slug: string;
  name: string;
  description: string;
  type: ProductType;
  /** SaaS için panel URL (SSO yönlendirmesi) */
  panelUrl?: string;
  features: string[];
  pricing: {
    monthly?: number;
    yearly?: number;
    oneTime?: number;
    currency: "TRY" | "USD" | "EUR";
  };
  isActive: boolean;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface IProductDocument extends Omit<IProduct, "_id"> {}
