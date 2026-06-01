import mongoose, {
  Schema,
  models,
  model,
  type Document,
  type Model,
} from "mongoose";

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

// src/models/Product.ts şemana eklenecek/güncellenecek alanlar:
const ProductSchema = new Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    discountPrice: { type: Number, default: 0 }, // İndirimli fiyat alanı
    type: { type: String, enum: ["saas", "service"], required: true },

    // 🔥 Yeni Eklenen Esnek Alanlar:
    durationDays: { type: Number, default: 30 }, // Admin panelden 30, 365 (yıllık) veya 0 (sınırsız) seçebileceksin
    salesCount: { type: Number, default: 0 }, // Ne kadar tercih edildiğini sayacak metrik

    // 📋 Hizmet siparişlerinde müşteriden istenecek dinamik form alanları (Örn: ["logo", "renk_tercihi", "rakip_firmalar"])
    requiredFields: { type: [String], default: [] },

    features: { type: [String], default: [] },
  },
  { timestamps: true },
);

export const Product: Model<IProductDocument> =
  models.Product ?? model<IProductDocument>("Product", ProductSchema);
