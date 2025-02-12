import express from 'express';
import { checkoutController } from '../../../controllers/checkout.controllers';

const router = express.Router();

router.post('/:userId/shipping-info', checkoutController.saveShippingInfo);
router.post('/:userId/payment', checkoutController.initiatePayment);
// router.post('/:userId/confirm-payment', CheckoutController.confirmPayment);

export default router;

