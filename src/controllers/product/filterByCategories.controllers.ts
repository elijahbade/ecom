import { Request, Response } from "express";
import ProductModel, { IProduct } from "../../models/product/product.model";
import asyncHandler from "../../middleware/aysnc.mw";

export const filterByCategories = asyncHandler(async (req: Request, res: Response): Promise<Response> => {
    // Get categories as comma-separated string from query
    const categoriesString = req.query.categories as string;
    
    if (!categoriesString) {
        return res.status(400).json({
            message: "Categories parameter is required",
            error: true,
            success: false
        });
    }

    // Split into array
    const categoryList = categoriesString.split(',');

    const products = await ProductModel.find({
        category: { $in: categoryList }
    });

    return res.status(200).json({
        data: products,
        message: "Products filtered successfully",
        error: false,
        success: true,
        count: products.length
    });
});