import { Request, Response } from "express";
import { cartService } from "../services/cart.service";
import asyncHandler from "../middleware/aysnc.mw";


class CartController {
  getCart = asyncHandler(async (req: Request, res: Response) => {
    const { userId, guestId } = req.params;
    const cart = await cartService.getCart(userId, guestId);
    res.status(200).json(cart || { message: "Cart is empty" });
  });

  addToCart = asyncHandler(async (req: Request, res: Response) => {
    const { userId, guestId } = req.params;
    const cart = await cartService.addToCart(userId, guestId, req.body);
    res.status(200).json(cart);
  });

  updateCartItem = asyncHandler(async (req: Request, res: Response) => {
    const { userId, guestId } = req.params;
    const cart = await cartService.updateCartItem(userId, guestId, req.body);
    res.status(200).json(cart);
  });

  removeCartItem = asyncHandler(async (req: Request, res: Response) => {
    const { userId, guestId } = req.params;
    const { productId } = req.params;
    const cart = await cartService.removeCartItem(userId, guestId, productId);
    res.status(200).json(cart);
  });

  clearCart = asyncHandler(async (req: Request, res: Response) => {
    const { userId, guestId } = req.params;
    const cart = await cartService.clearCart(userId, guestId);
    res.status(200).json(cart);
  });

  calculateTotals = asyncHandler(async (req: Request, res: Response) => {
    const { userId, guestId } = req.params;
    const totals = await cartService.calculateTotals(userId, guestId);
    res.status(200).json(totals);
  });
}

export const cartController = new CartController();
