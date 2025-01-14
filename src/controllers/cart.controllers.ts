import { Request, Response } from "express";
import { cartService } from "../services/cart.service";
import asyncHandler from "../middleware/aysnc.mw";
import { loginService } from "../services/login.service";

// class CartController {
//   getCart = asyncHandler(async (req: Request, res: Response) => {
//     const { userId } = req.params;
//     const cart = await cartService.getCart(userId);
//     res.status(200).json(cart || { message: "Cart is empty" });
//   });

//   addToCart = asyncHandler(async (req: Request, res: Response) => {
//     const { userId} = req.params;
//     const cart = await cartService.addToCart(userId, req.body);
//     res.status(200).json(cart);
//   });

//   updateCartItem = asyncHandler(async (req: Request, res: Response) => {
//     const { userId } = req.params;
//     const cart = await cartService.updateCartItem(userId, req.body);
//     res.status(200).json(cart);
//   });

//   removeCartItem = asyncHandler(async (req: Request, res: Response) => {
//     const { userId} = req.params;
//     const { productId } = req.params;
//     const cart = await cartService.removeCartItem(userId, productId);
//     res.status(200).json(cart);
//   });

//   clearCart = asyncHandler(async (req: Request, res: Response) => {
//     const { userId } = req.params;
//     const cart = await cartService.clearCart(userId);
//     res.status(200).json(cart);
//   });

//   calculateTotals = asyncHandler(async (req: Request, res: Response) => {
//     const { userId} = req.params;
//     const totals = await cartService.calculateTotals(userId);
//     res.status(200).json(totals);
//   });
// }

// export const cartController = new CartController();

class CartController {
  getCart = asyncHandler(async (req: Request, res: Response) => {
    // const userId = req.userId; // Extracted from middleware
    const { userId } = req.params;
    const cart = await cartService.getCart(userId);
    res.status(200).json(cart || { message: "Cart is empty" });
  });

  addToCart = asyncHandler(async (req: Request, res: Response) => {
    const { userId } = req.params;
    const cart = await cartService.addToCart(userId, req.body);
    res.status(200).json(cart);
  });

  updateCartItem = asyncHandler(async (req: Request, res: Response) => {
    const { userId } = req.params;
    const cart = await cartService.updateCartItem(userId, req.body);
    res.status(200).json(cart);
  });

  removeCartItem = asyncHandler(async (req: Request, res: Response) => {
    const { userId } = req.params;
    const { productId } = req.params;
    const cart = await cartService.removeCartItem(userId, productId);
    res.status(200).json(cart);
  });

  clearCart = asyncHandler(async (req: Request, res: Response) => {
    const { userId } = req.params;
    const cart = await cartService.clearCart(userId);
    res.status(200).json(cart);
  });

  calculateTotals = asyncHandler(async (req: Request, res: Response) => {
    const { userId } = req.params;
    const totals = await cartService.calculateTotals(userId);
    res.status(200).json(totals);
  });
}

export const cartController = new CartController();
