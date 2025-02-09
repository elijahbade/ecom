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
  // getCart = asyncHandler(async (req: Request, res: Response) => {
  //   // const userId = req.userId; // Extracted from middleware
  //   const { userId } = req.params;
  //   const cart = await cartService.getCart(userId);
  //   res.status(200).json(cart || { message: "Cart is empty" });
    
  // });

    getCart = asyncHandler(async (req: Request, res: Response) => {
      const { userId } = req.params;
      const cart = await cartService.getCart(userId);
  
      if (cart) {
        res.status(200).json({
          data: cart,
          count: cart.items?.length || 0,
          message: "Cart fetched successfully",
          error: false,
          success: true,
        });
      } else {
        res.status(200).json({
          data: null,
          count: 0,
          message: "Cart is empty",
          error: false,
          success: true,
        });
      }
    });
  

  
  addToCart = asyncHandler(async (req: Request, res: Response) => {
    const { userId } = req.params;
    const cart = await cartService.addToCart(userId, req.body);
    res.status(200).json(cart);
 } );


 updateCartProduct = asyncHandler(async (req: Request, res: Response): Promise<Response> => {
  try {
    // const { userId } = req.params;
    const { userId, productId, quantity } = req.body;
 
    console.log('Update cart request:', { userId, productId, quantity });
 
    const updatedCart = await cartService.updateAddToCartProduct(userId, {
      productId,
      quantity
    });
 
    console.log('Updated cart:', updatedCart);
 
    return res.json({
      data: updatedCart,
      message: "Cart product updated successfully",
      error: false,
      success: true
    });
  } catch (error: unknown) {
    console.error('Update cart error:', error);
    return res.json({
      message: error instanceof Error ? error.message : String(error), 
      error: true,
      success: false
    });
  }
 });


  countCartProducts = asyncHandler (async (req: Request, res: Response): Promise<Response> => {
   
    try {
      const {userId} = req.params;
      const count = await cartService.getCartProductCount(userId);

      return res.json({
        data: { count },
        message: "Cart products counted successfully",
        error: false,
        success: true
      });
    } catch (error: unknown) {
      return res.json({
        message: error instanceof Error ? error.message : String(error),
        error: true,
        success: false
      });
    }
  })



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
