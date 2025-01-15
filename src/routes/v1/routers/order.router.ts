import express from 'express';
import { orderController } from '../../../controllers/order.controllers';

const router = express.Router();

router.get('/:userId/history', orderController.getOrderHistory);
router.get('/track/:id', orderController.getOrderById);
router.patch('/:id/status', orderController.updateOrderStatus);

export default router;