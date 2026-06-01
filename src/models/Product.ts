import mongoose, { Schema, models, model, type Document, type Model } from "mongoose";

export type ProductType = "saas" | "service";

export interface IProduct {
  title: string;
  description: string;
  price: number;
  type: ProductType;
  features: string[];
  slug: string;
}

export interface IProductDocument extends IProduct, Document {}

const ProductSchema = new Schema<IProductDocument>(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    type: { type: String, enum: ["saas", "service"], required: true },
    features: [{ type: String }],
    slug: { type: String, required: true, unique: true, lowercase: true },
  },
  { timestamps: true }
);

export const Product: Model<IProductDocument> =
  models.Product ?? model<IProductDocument>("Product", ProductSchema);
