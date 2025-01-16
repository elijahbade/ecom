import express from 'express';
import { handlePaystackWebhook } from '../../../controllers/paystackWebhook.controllers';

const router = express.Router();

router.post('/paystack/webhook', handlePaystackWebhook);

export default router;