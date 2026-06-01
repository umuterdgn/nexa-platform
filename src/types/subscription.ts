export type SubscriptionStatus = "active" | "expired" | "cancelled" | "pending";

import type { Types } from "mongoose";

export interface ISubscription {
  _id: string;
  userId: Types.ObjectId | string;
  productId: Types.ObjectId | string;
  status: SubscriptionStatus;
  billingCycle: "monthly" | "yearly";
  startDate: Date;
  endDate: Date;
  autoRenew: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ISubscriptionDocument extends Omit<ISubscription, "_id"> {}
