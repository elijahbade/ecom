import { Request, Response } from 'express';
import { paystackService } from '../services/paystack.service';
import asyncHandler from '../middleware/aysnc.mw';


export const  handlePaystackWebhook = asyncHandler(async (req: Request, res: Response) => {

  try {
    const webhookData = req.body;

    // Validate Paystack signature (optional but recommended)

    const signature = req.headers['x-paystack-signature'];
    if (!paystackService.verifySignature(webhookData, signature)) {
      return res.status(400).send('Invalid signature');
    }

    await paystackService.handleWebhookEvent(webhookData);

    res.status(200).send('Webhook received');
  } catch (error) {
    console.error('Error handling webhook:', error);
    res.status(500).send('Internal Server Error');
  }
});
