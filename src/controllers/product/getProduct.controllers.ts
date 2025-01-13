import { Request, Response } from "express";
import ProductModel from "../../models/product/product.model";
import asyncHandler from "../../middleware/aysnc.mw";

export const getProducts = asyncHandler(async (req: Request, res: Response): Promise<Response> => {
  const allProducts = await ProductModel.find().sort({ createdAt: -1 });

  return res.json({
    message: "All Products",
    success: true,
    error: false,
    data: allProducts,
  });
});
