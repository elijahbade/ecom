import { Request, Response } from 'express';
import asyncHandler from '../middleware/aysnc.mw';
import { orderService } from '../services/order.service';
import { paystackService } from '../services/paystack.service';
import { cartService } from '../services/cart.service';

class CheckoutController {
  saveShippingInfo = asyncHandler(async (req: Request, res: Response) => {
    const { userId } = req.params;
    await orderService.saveShippingInfo(userId, req.body);
    res.status(200).json({ message: 'Shipping information saved' });
  });

  initiatePayment = asyncHandler(async (req: Request, res: Response) => {
    const { userId } = req.params;
  
    // Calculate totals and fetch cart details
    const { subtotal } = await cartService.calculateTotals(userId);
    const cart = await cartService.getCart(userId);
  
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }
  
    // Generate payment reference
    const paymentReference = `ORDER_${Date.now()}_${userId}`;
  
    // Create the order with "pending" payment status
    const order = await orderService.createOrder(userId, req.body.shippingInfo, paymentReference);

  
    // Initiate payment with Paystack
    const paymentData = await paystackService.initiatePayment({
      amount: subtotal,
      email: 'user@example.com', // Fetch this from user session/profile
      reference: paymentReference,
    });
  
    // Return payment initiation details
    res.status(200).json({
      message: 'Payment initiated',
      paymentUrl: paymentData.data.authorization_url,
      order,
    });
  });
  

  // confirmPayment = asyncHandler(async (req: Request, res: Response) => {
  //   const { reference } = req.query;
  //   const { userId } = req.params;
    
  //   const verificationData = await paystackService.verifyPayment(reference as string);
    
  //   if (verificationData.data.status === 'success') {
  //     const order = await orderService.createOrder(
  //       userId,
  //       req.body.shippingInfo,
  //       reference as string
  //     );
  //     res.status(200).json(order);
  //   } else {
  //     res.status(400).json({ message: 'Payment verification failed' });
  //   }
  // });

  confirmPayment = asyncHandler(async (req: Request, res: Response) => {
    const { reference } = req.query;
  
    if (!reference) {
      return res.status(400).json({ message: 'Payment reference is required' });
    }
  
    try {
      // Verify payment with Paystack
      const verificationData = await paystackService.verifyPayment(reference as string);
  
      if (verificationData.data.status !== 'success') {
        return res.status(400).json({ message: 'Payment verification failed' });
      }
  
      // Update order's payment status
      const updatedOrder = await orderService.updateOrderPaymentStatus(reference as string, 'paid');
  
      if (!updatedOrder) {
        return res.status(404).json({ message: 'Order not found for this payment reference' });
      }
  
      res.status(200).json({
        message: 'Payment verified and order updated',
        order: updatedOrder,
      });
    } catch (error: any) {
      console.error('Error confirming payment:', error.message);
      res.status(500).json({ message: 'An error occurred while confirming payment', error: error.message });
    }
  });
  

}

export const checkoutController = new CheckoutController();
