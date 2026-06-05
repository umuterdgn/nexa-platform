import mongoose, {
  Schema,
  models,
  model,
  type Document,
  type Model,
  type Types,
} from "mongoose";

// 🔥 1. "pending_payment" statüsü eklendi
export type SubscriptionStatus = "active" | "passive" | "pending_payment";

export interface ISubscription {
  userId: Types.ObjectId;
  productId: Types.ObjectId;
  status: SubscriptionStatus;
  startDate: Date;
  endDate: Date;
  merchantOid?: string; // 🔥 2. PayTR sipariş kodu için alan eklendi
}

export interface ISubscriptionDocument extends ISubscription, Document {}

/** Aktif aboneliklerde kalan gün sayısı (dashboard progress bar için). */
export function getDaysRemaining(
  sub: Pick<ISubscription, "endDate" | "status">,
): number {
  if (sub.status !== "active") return 0;
  const diff = new Date(sub.endDate).getTime() - Date.now();
  return Math.max(0, Math.ceil(diff / 86_400_000));
}

/** Toplam süre ve kalan süre yüzdesi (0–100). */
export function getSubscriptionProgress(sub: ISubscription): number {
  const total =
    new Date(sub.endDate).getTime() - new Date(sub.startDate).getTime();
  if (total <= 0) return 0;
  const remaining = getDaysRemaining(sub);
  const totalDays = Math.ceil(total / 86_400_000);
  return Math.min(100, Math.round((remaining / totalDays) * 100));
}

const SubscriptionSchema = new Schema<ISubscriptionDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    // 🔥 3. Enum listesi güncellendi
    status: {
      type: String,
      enum: ["active", "passive", "pending_payment"],
      default: "passive",
    },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    // 🔥 4. Şemaya PayTR kodu eklendi
    merchantOid: { type: String, required: false },
  },
  { timestamps: true },
);

SubscriptionSchema.index({ userId: 1, status: 1 });
// 🔥 Webhook'un siparişi anında bulabilmesi için özel index eklendi
SubscriptionSchema.index({ merchantOid: 1 });

export const Subscription: Model<ISubscriptionDocument> =
  models.Subscription ??
  model<ISubscriptionDocument>("Subscription", SubscriptionSchema);
