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
        if (category === 'all'){
            // Randomize the array in memory
            const allProducts = await ProductModel.find({ }).lean();
            const randomizedProducts = allProducts.sort(() => Math.random() - 0.5);

            return res.json({
                data: randomizedProducts,
                message: "Products fetched successfully",
                success: true,
                error: false
            });
        }

        // For a specific category
        const products = await ProductModel.find({ category });
        return res.json({
            data: products,
            message: "Products fetched successfully",
            success: true,
            error: false
        });
    } catch (err) {
        return res.status(500).json({
            message: "Server error",
            error: true,
            success: false
        });
    }
});

export default getProductsByCategory;

