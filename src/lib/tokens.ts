import crypto from "crypto";

export function generateSecureToken(): string {
  return crypto.randomBytes(32).toString("hex");
}

export function getTokenExpiry(hours = 1): Date {
  return new Date(Date.now() + hours * 60 * 60 * 1000);
}
