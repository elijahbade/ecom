import { Request, Response, NextFunction } from 'express';
import { paystackService } from '../services/paystack.service';
import asyncHandler from '../middleware/aysnc.mw';
import ErrorResponse from '../utils/error.utils';


export const  handlePaystackWebhook = asyncHandler(async (req: Request, res: Response, next: NextFunction ) => {

  try {
    const webhookData = req.body;

    // Validate Paystack signature (optional but recommended)

    const signature = req.headers['x-paystack-signature'];
    if (!paystackService.verifySignature(webhookData, signature)) {
      return next(new ErrorResponse('Error', 400, ["Invalid Singature"]))
    }

    await paystackService.handleWebhookEvent(webhookData);

    res.status(200).send('Webhook received');
    
  } catch (error) {
    console.error('Error handling webhook:', error);
    return res.status(500).json({
      success: false,
      message: "Error encountered using webhook",
      error: error
    });
  }

  }
);


