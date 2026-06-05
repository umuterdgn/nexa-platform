export type ProductType = "saas" | "service";
export interface ProductCardData {
  slug: string;
  title: string;
  description: string;
  price: number;
  features: string[];
  type: ProductType;
  highlighted?: boolean;
}
