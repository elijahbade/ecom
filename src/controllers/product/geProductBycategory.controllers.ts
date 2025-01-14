import { Request, Response } from "express";
import ProductModel from "../../models/product/product.model";
import asyncHandler from "../../middleware/aysnc.mw";




const getProductsByCategory = asyncHandler(async (req: Request, res: Response) => {
    // Extract category from query parameters for GET request
    const { category } = req.query;

    if (!category) {
        return res.status(400).json({
            message: "Category is required",
            success: false,
            error: true
        });
    }

    try {
        const products = await ProductModel.find({ category });

        res.json({
            data: products,
            message: "Products fetched successfully",
            success: true,
            error: false
        });
    } catch (err) {
        res.status(500).json({
            message: "Server error",
            error: true,
            success: false
        });
    }
});

export default getProductsByCategory;
