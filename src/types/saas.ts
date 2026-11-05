export type BillingCycle = "MONTHLY" | "YEARLY";
export type PricingTier = "BASIC" | "PRO" | "ENTERPRISE";
export type OrderStatus = "PENDING" | "SUCCESS" | "FAILED" | "REFUNDED";
export type TenantStatus = "IDLE" | "PROVISIONING" | "ACTIVE" | "FAILED";

export interface SaaSPricingPlan {
  id: string;
  tier: PricingTier;
  name: string;
  badge?: string;
  description: string;
  monthlyPrice: number;
  yearlyPrice: number; // Yıllık seçimde aylık karşılığı (veya peşin yıllık)
  currency: string;
  isPopular?: boolean;
  features: string[];
  maxUsers: number;
  storageGb: number;
}

export interface SaaSProductAddon {
  id: string;
  key: string;
  title: string;
  description: string;
  monthlyPrice: number;
  yearlyPrice: number;
  iconName?: string;
}

export interface SaaSProductFeature {
  title: string;
  description: string;
  category?: string;
  icon?: string;
}

export interface SaaSProductDetail {
  id: string;
  slug: string;
  title: string;
  tagline: string;
  description: string;
  badge?: string;
  category: "SAAS" | "SERVICE";
  isActive: boolean;
  ssoUrl?: string; // Yönetim Paneli SSO URL (Örn: https://tamvaktinde.com.tr/auth/sso)
  panelUrl?: string;
  provisioningApiUrl?: string;
  heroMetrics?: { value: string; label: string }[];
  features: SaaSProductFeature[];
  plans: SaaSPricingPlan[];
  addons: SaaSProductAddon[];
}

export interface CustomerSubscription {
  id: string;
  productSlug: string;
  productTitle: string;
  productTagline?: string;
  category?: string;
  badge?: string;
  planName: string;
  planType: string;
  billingCycle: "MONTHLY" | "YEARLY" | "ONE_TIME";
  status: "active" | "expired" | "pending_payment";
  startDate: string;
  endDate: string;
  daysRemaining: number;
  totalDays: number;
  progressPercentage: number;
  ssoUrl: string; // Token ile yönlendirilecek SSO uç noktası (/sso?slug=...)
  externalSsoUrl?: string; // Gerçek harici SSO URL (Örn: https://tamvaktinde.com.tr/auth/sso)
  orderNumber?: string;
  invoiceNumber: string;
  invoiceAmount: number;
  invoiceStatus: "PAID" | "PENDING";
  invoiceDate: string;
  activeAddons?: { key: string; title: string }[];
}

export interface CheckoutPayload {
  productSlug: string;
  productId: string;
  planId: string;
  planTier: PricingTier;
  billingCycle: BillingCycle;
  selectedAddonKeys: string[];
  customer: {
    fullName: string;
    email: string;
    phone: string;
    companyName: string;
    taxNumber?: string;
    taxOffice?: string;
    subdomainPrefix?: string; // Örn: "sirketim" -> sirketim.nxa.com.tr
  };
}

export interface CheckoutResponse {
  success: boolean;
  orderNumber: string;
  totalAmount: number;
  currency: string;
  paymentUrl?: string;
  paymentToken?: string;
  iframeHtml?: string;
  message?: string;
}

export interface TenantProvisioningPayload {
  orderNumber: string;
  productSlug: string;
  companyName: string;
  subdomain: string;
  adminEmail: string;
  adminName: string;
  planTier: PricingTier;
  maxUsers: number;
  storageGb: number;
  billingCycle: BillingCycle;
  activeAddons: string[];
}

export interface TenantProvisioningResult {
  success: boolean;
  tenantId?: string;
  subdomain?: string;
  accessUrl?: string;
  tempPassword?: string;
  apiKey?: string;
  error?: string;
}

