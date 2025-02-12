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



/**
 * Get latest product prices.
 * @route GET /api/products/latest-prices
 */
export const getLatestPrices = asyncHandler(async (req: Request, res: Response): Promise<Response> => {
  // Fetch only required fields to optimize performance
  const latestPrices = await ProductModel.find()
    .select("name price updatedAt") // Fetch only necessary fields
    .sort({ updatedAt: -1 });

  return res.json({
    message: "Latest Product Prices",
    success: true,
    error: false,
    data: latestPrices,
  });
});
