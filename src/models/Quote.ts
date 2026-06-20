import mongoose, { Schema, models } from "mongoose";

const quoteSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String },
    phone: { type: String },
    details: { type: String, required: true },
    status: { type: String, default: "bekliyor" }, // bekliyor, incelendi, onaylandi gibi admin panelinden güncelleyebilmen için
  },
  { timestamps: true }
);

export const Quote = models.Quote || mongoose.model("Quote", quoteSchema);