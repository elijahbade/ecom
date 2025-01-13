import { Request, Response } from "express";
import ProductModel, { IProduct } from "../../models/product/product.model";
import asyncHandler from "../../middleware/aysnc.mw";

export const uploadProduct = asyncHandler(async (req: Request, res: Response): Promise<Response> => {
  // Create a new product instance with request body
  const uploadProduct = new ProductModel(req.body);

  // Save the product to the database
  const saveProduct = await uploadProduct.save();

  return res.status(201).json({
    message: "Product uploaded successfully",
    error: false,
    success: true,
    data: saveProduct,
  });
});
