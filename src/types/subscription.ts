import type { Types } from "mongoose";

export type SubscriptionStatus =
  | "active"
  | "passive"
  | "pending_payment"
  | "expired"
  | "cancelled";

export type BillingCycle = "monthly" | "yearly" | "one_time";

export interface ISubscription {
  _id: string;
  userId: Types.ObjectId | string;
  productId: Types.ObjectId | string;
  status: SubscriptionStatus;
  billingCycle?: BillingCycle;
  startDate: Date;
  endDate: Date;
  merchantOid?: string;
  invoiceSent: boolean;
  autoRenew?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ISubscriptionDocument extends Omit<ISubscription, "_id"> {}
