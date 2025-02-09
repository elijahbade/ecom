import { Request, Response } from "express";
import ProductModel, { IProduct } from "../../models/product/product.model";
import asyncHandler from "../../middleware/aysnc.mw";


export const deleteProduct = asyncHandler(async (req: Request, res: Response): Promise<Response> => {
    const { productId } = req.params;
  
    if (!productId) {
      return res.status(400).json({
        message: "Product ID is required",
        error: true,
        success: false
      });
    }
  
    const product = await ProductModel.findByIdAndDelete(productId);
  
    if (!product) {
      return res.status(404).json({
        message: "Product not found",
        error: true,
        success: false
      });
    }
  
    return res.status(200).json({
      message: "Product deleted successfully",
      success: true,
      error: false
    });
  });
  
  