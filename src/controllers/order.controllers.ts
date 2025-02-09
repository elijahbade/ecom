import { Request, Response } from 'express';
import asyncHandler from '../middleware/aysnc.mw';
import { orderService } from '../services/order.service';
import { IOrder, Order } from '../models/order.model';

class OrderController {
  getAllOrders  = asyncHandler(async (req: Request, res: Response) => {
    const orders = await orderService.getAllOrders();
    res.status(200).json(orders);
  });

  getUserOrders = asyncHandler(async (req: Request, res: Response) => {
    const {userId } = req.params;
    const orders = await orderService.getUserOrders({userId});
    res.status(200).json(orders);
  })


  getOrderById = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const order = await orderService.getOrderById({ orderId: id });
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.status(200).json(order);
  });


   updateOrderPaymentStatus = asyncHandler(
    async (req: Request, res: Response): Promise<Response> => {
      const { reference, status }: { reference: string; status: IOrder['paymentStatus'] } = req.body;
  
      const updatedOrder = await Order.findOneAndUpdate(
        { paymentReference: reference },
        { paymentStatus: status },
        { new: true }
      );
  
      if (!updatedOrder) {
        return res.status(404).json({ message: "Order not found" });

      }

      return res.status(200).json({status: 200, message: "payment status updated", order: updatedOrder})
    }
  );
  


  updateOrderStatus = asyncHandler(async (req: Request, res: Response) => {
    const { orderId, status } = req.body;
    const order = await orderService.updateOrderStatus(orderId, status);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
      
    }
    return res.status(200).json({status: 200, message: "Order status updated", order})

  });
}

export const orderController = new OrderController();