import mongoose, { Schema, model, models } from "mongoose";

export interface IProductDocument {
  title: string;
  slug: string;
  description: string;
  price: number;
  discountPrice?: number; // İndirim alanı
  type: "saas" | "service";
  durationDays?: number;  // Süre alanı (30 / 365)
  salesCount?: number;
  requiredFields?: string[];
  features?: string[];
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema = new Schema<IProductDocument>(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    discountPrice: { type: Number, default: 0 }, // Şemaya zorunlu ekleme
    type: { type: String, enum: ["saas", "service"], required: true },
    durationDays: { type: Number, default: 30 }, // Şemaya zorunlu ekleme
    salesCount: { type: Number, default: 0 },
    requiredFields: { type: [String], default: [] },
    features: { type: [String], default: [] },
  },
  { timestamps: true }
);

// Named export yapımızı koruyoruz
export const Product = models.Product || model<IProductDocument>("Product", ProductSchema);