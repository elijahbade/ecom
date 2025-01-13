import mongoose, { Schema, Document } from "mongoose";

// Define the product interface
export interface IProduct extends Document {
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  imageUrl?: string;
}

// Define the product schema
const ProductSchema: Schema = new Schema<IProduct>(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: String, required: true },
    stock: { type: Number, required: true },
    imageUrl: { type: String, required: false },
  },
  {
    timestamps: true,
  }
);

// Create and export the product model
const ProductModel = mongoose.model<IProduct>("Product", ProductSchema);
export default ProductModel;
