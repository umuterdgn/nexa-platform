export function getProductIcon(slug: string): "calendar" | "wallet" {
  if (slug.includes("kasa")) return "wallet";
  return "calendar";
}
