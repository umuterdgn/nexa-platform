import crypto from "crypto";

export function createPaytrToken(
  hashStr: string,
  merchantKey: string,
  merchantSalt: string
): string {
  return crypto
    .createHmac("sha256", merchantKey)
    .update(hashStr + merchantSalt)
    .digest("base64");
}

export function buildUserBasket(
  title: string,
  priceTl: number
): string {
  const basket = [[title, priceTl.toFixed(2), 1]];
  return Buffer.from(JSON.stringify(basket)).toString("base64");
}
