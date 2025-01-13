import { Request, Response } from "express";
import ProductModel from "../../models/product/product.model";
import asyncHandler from "../../middleware/aysnc.mw";

const getCategoryProduct = asyncHandler (async (req: Request, res: Response): Promise<Response> => {
  try {
    // Retrieve distinct categories from the product model
    const productCategory: string[] = await ProductModel.distinct("category");

    console.log("Categories:", productCategory);

    // Array to store one product from each category
    const productByCategory: any[] = [];

    // Fetch one product for each category
    for (const category of productCategory) {
      const product = await ProductModel.findOne({ category });
      if (product) {
        productByCategory.push(product);
      }
    }

    // Send success response
   return  res.json({
      message: "Category product",
      data: productByCategory,
      success: true,
      error: false,
    });
  } catch (err: any) {
    // Handle errors
  return  res.status(400).json({
      message: err.message || "An error occurred",
      error: true,
      success: false,
    });
  }
});

export default getCategoryProduct;
