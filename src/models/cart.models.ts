import mongoose, { Schema, Document } from "mongoose";

export interface ICartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
}

export interface ICart extends Document {
  userId?: string;
  guestId?: string;
  items: ICartItem[];
}

const CartItemSchema = new Schema<ICartItem>({
  productId: { type: String, required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true, min: 1 },
});

const CartSchema = new Schema<ICart>({
  userId: { type: String, required: true, unique: true },
  items: { type: [CartItemSchema], default: [] },
});

export const Cart = mongoose.model<ICart>("Cart", CartSchema);
