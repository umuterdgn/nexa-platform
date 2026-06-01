import mongoose, {
  Schema,
  models,
  model,
  type Document,
  type Model,
  type Types,
} from "mongoose";

export type UserRole = "admin" | "customer";

export interface IUser {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  subscriptions: Types.ObjectId[];
  createdAt: Date;
}

export interface IUserDocument extends IUser, Document {}

const UserSchema = new Schema<IUserDocument>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true, select: false },
    role: { type: String, enum: ["admin", "customer"], default: "customer" },
    subscriptions: [{ type: Schema.Types.ObjectId, ref: "Subscription" }],
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

const User = mongoose.models.User || mongoose.model("User", UserSchema);
export default User;