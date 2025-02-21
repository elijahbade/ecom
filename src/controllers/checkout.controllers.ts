import { Request, Response } from 'express';
import asyncHandler from '../middleware/aysnc.mw';
import { orderService } from '../services/order.service';
import { paystackService } from '../services/paystack.service';
import { cartService } from '../services/cart.service';
import ProductModel from '../models/product/product.model';

// class CheckoutController {
//   saveShippingInfo = asyncHandler(async (req: Request, res: Response) => {
//     const { userId } = req.params;
//     await orderService.saveShippingInfo(userId, req.body);
//     res.status(200).json({ message: 'Shipping information saved' });
//   });

// //   initiatePayment = asyncHandler(async (req: Request, res: Response) => {
// //     const { userId } = req.params;
// //     // const { userId } = req.body;

  
// //     // Calculate totals and fetch cart details
// //     const { subtotal } = await cartService.calculateTotals(userId);
// //     const dbCart = await cartService.getCart(userId);
 
// //     const { shippingInfo, cartItems } = req.body;

// // if (!cartItems || cartItems.length === 0) {
// //   return res.status(400).json({ message: 'Cart is empty' });
// // }
  
// //     // if (!cart || cart.items.length === 0) {
// //     //   return res.status(400).json({ message: 'Cart is empty' });
// //     // }
  
// //     // Generate payment reference
// //     const paymentReference = `ORDER_${Date.now()}_${userId}`;
  
// //     // Create the order with "pending" payment status
// //     const order = await orderService.createOrder(userId, req.body.shippingInfo, paymentReference);

  
// //     // Initiate payment with Paystack
// //     const paymentData = await paystackService.initiatePayment({
// //       amount: subtotal,
// //       email: 'user@example.com', // Fetch this from user session/profile
// //       reference: paymentReference,
// //     });
  
// //     // Return payment initiation details
// //     res.status(200).json({
// //       message: 'Payment initiated',
// //       paymentUrl: paymentData.data.authorization_url,
// //       order,
// //     });
// //   });
  

//   // confirmPayment = asyncHandler(async (req: Request, res: Response) => {
//   //   const { reference } = req.query;
//   //   const { userId } = req.params;
    
//   //   const verificationData = await paystackService.verifyPayment(reference as string);
    
//   //   if (verificationData.data.status === 'success') {
//   //     const order = await orderService.createOrder(
//   //       userId,
//   //       req.body.shippingInfo,
//   //       reference as string
//   //     );
//   //     res.status(200).json(order);
//   //   } else {
//   //     res.status(400).json({ message: 'Payment verification failed' });
//   //   }
//   // });

//   confirmPayment = asyncHandler(async (req: Request, res: Response) => {
//     const { reference } = req.query;
  
//     if (!reference) {
//       return res.status(400).json({ message: 'Payment reference is required' });
//     }
  
//     try {
//       // Verify payment with Paystack
//       const verificationData = await paystackService.verifyPayment(reference as string);
  
//       if (verificationData.data.status !== 'success') {
//         return res.status(400).json({ message: 'Payment verification failed' });
//       }
  
//       // Update order's payment status
//       const updatedOrder = await orderService.updateOrderPaymentStatus(reference as string, 'paid');
  
//       if (!updatedOrder) {
//         return res.status(404).json({ message: 'Order not found for this payment reference' });
//       }
  
//       res.status(200).json({
//         message: 'Payment verified and order updated',
//         order: updatedOrder,
//       });
//     } catch (error: any) {
//       console.error('Error confirming payment:', error.message);
//       res.status(500).json({ message: 'An error occurred while confirming payment', error: error.message });
//     }
//   });
  


// }// types/cart.ts
// import { Types } from 'mongoose';

// // Match your existing DTOs
// export interface ShippingInfoDTO {
//   fullName: string;
//   address: string;
//   city: string;
//   state?: string;
//   country?: string;
//   postalCode?: string;
//   phone: string;
// }

// // Match your existing IOrderItem
// export interface IOrderItem {
//   productId: Types.ObjectId;
//   name: string;
//   quantity: number;
//   price: number;
// }

// // Interface for client-side cart items
// export interface ClientCartItem {
//   id: string;
//   name: string;
//   price: number;
//   quantity: number;
// }

// // Interface for price updates
// export interface PriceUpdate {
//   id: string;
//   name: string;
//   oldPrice: number;
//   newPrice: number;
//   quantity: number;
// }

// // Main verification response interface
// export interface CartVerificationResult {
//   isValid: boolean;
//   total: number;
//   verifiedItems: IOrderItem[];  // Using IOrderItem instead of BaseCartItem
//   updatedItems: PriceUpdate[] | null;
// }

// controllers/checkout.controller.ts
import { Types } from 'mongoose';
import { Order, IOrder } from '../models/order.model';
import { CartVerificationResult ,ClientCartItem } from '../types/cart';
import { IOrderItem } from '../models/order.model';
import { PriceUpdate } from '../types/cart';
import { ShippingInfoDTO } from '../dtos/order.dtos';

class CheckoutController {
  // Keep your existing shipping info save method
  saveShippingInfo = asyncHandler(async (req: Request, res: Response) => {
    const { userId } = req.params;
    await orderService.saveShippingInfo(userId, req.body);
    res.status(200).json({ message: 'Shipping information saved' });
  });

  initiatePayment = asyncHandler(async (req: Request, res: Response) => {
    const { userId } = req.params;
    const { cartItems, shippingInfo }: { 
      cartItems: ClientCartItem[], 
      shippingInfo: ShippingInfoDTO 
    } = req.body;

    if (!cartItems || cartItems.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    try {
      // First save shipping info
      await orderService.saveShippingInfo(userId, shippingInfo);

      // Then verify cart prices
      const verifiedCartData = await orderService.verifyCartPrices(cartItems);
  
      if (!verifiedCartData.isValid) {
        return res.status(400).json({ 
          message: 'Cart prices have changed',
          updatedPrices: verifiedCartData.updatedItems
        });
      }

      const amountInKobo = verifiedCartData.total;
      const paymentReference = `ORDER_${Date.now()}_${userId}`;

      // Create order with both verified items and shipping info
      const order = await Order.create({
        userId: new Types.ObjectId(userId),
        items: verifiedCartData.verifiedItems,
        shippingInfo, // Include shipping info in order creation
        totalAmount: verifiedCartData.total,
        paymentStatus: 'pending',
        orderStatus: 'processing',
        paymentReference
      });

      // Initiate payment with Paystack
      const paymentData = await paystackService.initiatePayment({
        amount: amountInKobo,
        email: shippingInfo.email, // Use email from shipping info
        reference: paymentReference,
      });

      return res.status(200).json({
        message: 'Payment initiated',
        paymentUrl: paymentData.data.authorization_url,
        order,
      });
    } catch (error) {
      console.error('Error during payment initialization:', error);
      return res.status(500).json({ 
        message: 'Failed to process payment',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

}

export const checkoutController = new CheckoutController();