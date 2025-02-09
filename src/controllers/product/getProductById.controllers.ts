import { Request, Response } from "express";
import ProductModel, { IProduct } from "../../models/product/product.model";
import asyncHandler from "../../middleware/aysnc.mw";




export const getProductById = asyncHandler(async (req: Request, res: Response): Promise<Response> => {
    // Get productId from URL parameters instead of body
    const { productId } = req.params;

    if (!productId) {
        return res.status(400).json({
            message: "Product ID is required",
            error: true,
            success: false
        });
    }

    const product = await ProductModel.findById(productId);

    if (!product) {
        return res.status(404).json({
            message: "Product not found",
            error: true,
            success: false
        });
    }

    return res.status(200).json({
        data: product,
        message: "Product fetched successfully",
        success: true,
        error: false
    });
});