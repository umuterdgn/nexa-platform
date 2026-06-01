export interface IUser {
  _id: string;
  name: string;
  email: string;
  company?: string;
  phone?: string;
  role: "customer" | "admin";
  image?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUserDocument extends Omit<IUser, "_id"> {
  passwordHash: string;
}
