import mongoose, { Schema, model, models } from "mongoose";
import type { BillingCycle, ProductType } from "@/types/product";

export interface IProductPricing {
  monthly?: number;
  yearly?: number;
  oneTime?: number;
  discountMonthly?: number;
  discountYearly?: number;
  discountOneTime?: number;
  currency: "TRY" | "USD" | "EUR";
}

export interface IProductUsageQuotas {
  maxUsers?: number;
  maxTransactions?: number;
}

export interface IProductDocument {
  title: string;
  slug: string;
  description: string;
  type: ProductType;
  businessId: mongoose.Types.ObjectId;
  panelUrl?: string;
  features?: string[];
  pricing: IProductPricing;
  /** Geriye dönük uyumluluk */
  price?: number;
  discountPrice?: number;
  durationDays?: number;
  salesCount?: number;
  requiredFields?: string[];
  usageQuotas?: IProductUsageQuotas;
  isActive?: boolean;
  sortOrder?: number;
  createdAt: Date;
  updatedAt: Date;
}

const PricingSchema = new Schema<IProductPricing>(
  {
    monthly: { type: Number },
    yearly: { type: Number },
    oneTime: { type: Number },
    discountMonthly: { type: Number },
    discountYearly: { type: Number },
    discountOneTime: { type: Number },
    currency: {
      type: String,
      enum: ["TRY", "USD", "EUR"],
      default: "TRY",
    },
  },
  { _id: false },
);

const UsageQuotasSchema = new Schema<IProductUsageQuotas>(
  {
    maxUsers: { type: Number },
    maxTransactions: { type: Number },
  },
  { _id: false },
);

const ProductSchema = new Schema<IProductDocument>(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    type: { type: String, enum: ["saas", "service"], required: true },
    businessId: {
      type: Schema.Types.ObjectId,
      ref: "Business",
      required: true,
      index: true,
    },
    panelUrl: { type: String },
    features: { type: [String], default: [] },
    pricing: { type: PricingSchema, default: () => ({ currency: "TRY" }) },
    price: { type: Number },
    discountPrice: { type: Number, default: 0 },
    durationDays: { type: Number, default: 30 },
    salesCount: { type: Number, default: 0 },
    requiredFields: { type: [String], default: [] },
    usageQuotas: { type: UsageQuotasSchema, default: {} },
    isActive: { type: Boolean, default: true },
    sortOrder: { type: Number, default: 0 },
  },
  { timestamps: true },
);

ProductSchema.index({ type: 1, isActive: 1 });

export type { BillingCycle };

export const Product =
  models.Product || model<IProductDocument>("Product", ProductSchema);
