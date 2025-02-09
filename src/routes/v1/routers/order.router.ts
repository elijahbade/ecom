import express from 'express';
import { orderController } from '../../../controllers/order.controllers';
import {protect, rbac} from '../../../middleware/auth.mw';

const router = express.Router();

router.get('/history', protect, rbac("admin"), orderController.getAllOrders);
router.get('/history/:userId',  orderController.getUserOrders);
router.get('/track/:OrderId', protect, rbac("admin"), orderController.getOrderById);
router.patch('/order-status', protect, rbac("admin"), orderController.updateOrderStatus);
router.patch('/payment-status', protect,  rbac("admin"), orderController.updateOrderPaymentStatus);


export default router;

