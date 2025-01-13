import { Request, Response } from "express";
import ProductModel, { IProduct } from "../../models/product/product.model";
import asyncHandler from "../../middleware/aysnc.mw";

export const updateProduct = asyncHandler(async (req: Request, res: Response): Promise<Response> => {
  const { _id, ...updateData } = req.body;

  if (!_id) {
    return res.status(400).json({
      message: "Product ID (_id) is required",
      error: true,
      success: false,
    });
  }

  const updatedProduct = await ProductModel.findByIdAndUpdate(_id, updateData, { new: true });

  if (!updatedProduct) {
    return res.status(404).json({
      message: "Product not found",
      error: true,
      success: false,
    });
  }

  return res.json({
    message: "Product updated successfully",
    data: updatedProduct,
    success: true,
    error: false,
  });
});
