import { Request, Response } from 'express';
import asyncHandler from '../middleware/aysnc.mw';
import { orderService } from '../services/order.service';
import { paystackService } from '../services/paystack.service';

class CheckoutController {
  saveShippingInfo = asyncHandler(async (req: Request, res: Response) => {
    const { userId } = req.params;
    await orderService.saveShippingInfo(userId, req.body);
    res.status(200).json({ message: 'Shipping information saved' });
  });

  initiatePayment = asyncHandler(async (req: Request, res: Response) => {
    const { userId } = req.params;
    const paymentData = await orderService.initiatePayment(userId);
    res.status(200).json(paymentData);
  });

  confirmPayment = asyncHandler(async (req: Request, res: Response) => {
    const { reference } = req.query;
    const { userId } = req.params;
    
    const verificationData = await paystackService.verifyPayment(reference as string);
    
    if (verificationData.data.status === 'success') {
      const order = await orderService.createOrder(
        userId,
        req.body.shippingInfo,
        reference as string
      );
      res.status(200).json(order);
    } else {
      res.status(400).json({ message: 'Payment verification failed' });
    }
  });
}

export const checkoutController = new CheckoutController();
