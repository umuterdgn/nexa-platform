import type { ProductType } from "@/models/Product";

export interface ProductCardData {
  slug: string;
  title: string;
  description: string;
  price: number;
  features: string[];
  type: ProductType;
  highlighted?: boolean;
}
