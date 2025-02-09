import { Request, Response } from "express";
import ProductModel from "../../models/product/product.model";
import asyncHandler from "../../middleware/aysnc.mw";

// export const searchProducts = asyncHandler(async (req: Request, res: Response): Promise<Response> => {

//     const searchQuery = req.query.q as string;

//     if (!searchQuery) {
//         return res.status(400).json({
//             message: "Search query is required",
//             error: true,
//             success: false
//         });
//     }

//     // Create case-insensitive regex pattern
//     const searchPattern = new RegExp(searchQuery, 'i');

//     const products = await ProductModel.find({
//         $or: [
//             { name: searchPattern },
//             { category: searchPattern }
//         ]
//     });

//     return res.status(200).json({
//         data: products,
//         message: "Search results retrieved successfully",
//         error: false,
//         success: true,
//         count: products.length
//     });
// });




// export const searchProducts = asyncHandler(async (req: Request, res: Response): Promise<Response> => {
//     const { 
//         q: searchQuery, 
//         minPrice, 
//         maxPrice, 
//         category,
//         sortBy = 'relevance',  // 'relevance', 'price_asc', 'price_desc'
//         limit = 10,
//         page = 1
//     } = req.query;

//     if (!searchQuery) {
//         return res.status(400).json({
//             message: "Search query is required",
//             error: true,
//             success: false
//         });
//     }

//     // Build match conditions
//     const matchConditions: any = {};
    
//     // Text search condition
//     if (searchQuery) {
//         matchConditions.$text = { $search: searchQuery as string };
//     }

//     // Price range condition
//     if (minPrice || maxPrice) {
//         matchConditions.price = {};
//         if (minPrice) matchConditions.price.$gte = Number(minPrice);
//         if (maxPrice) matchConditions.price.$lte = Number(maxPrice);
//     }

//     // Category filter
//     if (category) {
//         matchConditions.category = category;
//     }

//     // Only show products in stock
//     matchConditions.stock = { $gt: 0 };

//     // Build sort conditions
//     let sortConditions: any = {};
//     switch(sortBy) {
//         case 'price_asc':
//             sortConditions.price = 1;
//             break;
//         case 'price_desc':
//             sortConditions.price = -1;
//             break;
//         default:
//             sortConditions = { score: { $meta: "textScore" } };
//     }

//     try {
//         // Execute aggregation pipeline
//         const pipeline = [
//             // Match stage
//             { 
//                 $match: matchConditions 
//             },
//             // Add text score
//             { 
//                 $addFields: { 
//                     score: { $meta: "textScore" },
//                     // Add custom boost for exact name matches
//                     exactNameMatch: {
//                         $cond: [
//                             { $eq: ["$name", searchQuery] },
//                             10,
//                             0
//                         ]
//                     }
//                 }
//             },
//             // Sort stage
//             { 
//                 $sort: sortConditions 
//             },
//             // Skip for pagination
//             { 
//                 $skip: (Number(page) - 1) * Number(limit) 
//             },
//             // Limit results
//             { 
//                 $limit: Number(limit) 
//             },
//             // Project stage (shape the output)
//             {
//                 $project: {
//                     name: 1,
//                     description: 1,
//                     price: 1,
//                     category: 1,
//                     stock: 1,
//                     imageUrl: 1,
//                     score: 1,
//                     exactNameMatch: 1,
//                     relevanceScore: { 
//                         $add: ["$score", "$exactNameMatch"] 
//                     }
//                 }
//             }
//         ];

//         // Get paginated results
//         const results = await ProductModel.aggregate(pipeline);
        
//         // Get total count for pagination
//         const totalCount = await ProductModel.countDocuments(matchConditions);

//         return res.status(200).json({
//             data: results,
//             message: "Search results retrieved successfully",
//             error: false,
//             success: true,
//             pagination: {
//                 currentPage: Number(page),
//                 totalPages: Math.ceil(totalCount / Number(limit)),
//                 totalResults: totalCount,
//                 hasNextPage: Number(page) * Number(limit) < totalCount,
//                 hasPrevPage: Number(page) > 1
//             }
//         });

//     } catch (error) {
//         console.error('Search error:', error);
//         return res.status(500).json({
//             message: "Error performing search",
//             error: true,
//             success: false
//         });
//     }
// });


export const searchProducts = asyncHandler(async (req: Request, res: Response): Promise<Response> => {
    const {
        q: searchQuery,
        minPrice,
        maxPrice,
        category,
        sortBy = 'relevance',
        limit = 10,
        page = 1,
        suggest = false, // New flag to determine if suggestions are requested
    } = req.query;

    if (!searchQuery && !suggest) {
        return res.status(400).json({
            message: "Search query is required",
            error: true,
            success: false,
        });
    }

    // Build match conditions
    const matchConditions: any = {};

    if (searchQuery) {
        matchConditions.$text = { $search: searchQuery as string };
    }

    if (minPrice || maxPrice) {
        matchConditions.price = {};
        if (minPrice) matchConditions.price.$gte = Number(minPrice);
        if (maxPrice) matchConditions.price.$lte = Number(maxPrice);
    }

    if (category) {
        matchConditions.category = category;
    }

    matchConditions.stock = { $gt: 0 };

    // Suggestion Logic
    if (suggest) {
        try {
            const suggestions = await ProductModel.find({
                name: { $regex: new RegExp(searchQuery as string, 'i') },
            })
                .select('name')
                .limit(5);
            return res.status(200).json({
                data: suggestions,
                message: "Suggestions retrieved successfully",
                error: false,
                success: true,
            });
        } catch (error) {
            console.error("Suggestion error:", error);
            return res.status(500).json({
                message: "Error retrieving suggestions",
                error: true,
                success: false,
            });
        }
    }

    // Build sort conditions
    let sortConditions: any = {};
    switch (sortBy) {
        case 'price_asc':
            sortConditions.price = 1;
            break;
        case 'price_desc':
            sortConditions.price = -1;
            break;
        default:
            sortConditions = { score: { $meta: "textScore" } };
    }

    try {
        const pipeline = [
            { $match: matchConditions },
            { $addFields: { score: { $meta: "textScore" } } },
            { $sort: sortConditions },
            { $skip: (Number(page) - 1) * Number(limit) },
            { $limit: Number(limit) },
            {
                $project: {
                    name: 1,
                    description: 1,
                    price: 1,
                    category: 1,
                    stock: 1,
                    imageUrl: 1,
                    score: 1,
                },
            },
        ];

        const results = await ProductModel.aggregate(pipeline);
        const totalCount = await ProductModel.countDocuments(matchConditions);

        return res.status(200).json({
            data: results,
            message: "Search results retrieved successfully",
            error: false,
            success: true,
            pagination: {
                currentPage: Number(page),
                totalPages: Math.ceil(totalCount / Number(limit)),
                totalResults: totalCount,
                hasNextPage: Number(page) * Number(limit) < totalCount,
                hasPrevPage: Number(page) > 1,
            },
        });
    } catch (error) {
        console.error("Search error:", error);
        return res.status(500).json({
            message: "Error performing search",
            error: true,
            success: false,
        });
    }
});
