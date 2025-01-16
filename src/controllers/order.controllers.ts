import { Request, Response } from 'express';
import asyncHandler from '../middleware/aysnc.mw';
import { orderService } from '../services/order.service';
import { IOrder, Order } from '../models/order.model';

class OrderController {
  getOrderHistory = asyncHandler(async (req: Request, res: Response) => {
    const { userId } = req.params;
    const orders = await orderService.getOrderHistory(userId);
    res.status(200).json(orders);
  });

  getOrderById = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const order = await orderService.getOrderById(id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.status(200).json(order);
  });


  async updateOrderPaymentStatus(
    reference: string, 
    status: IOrder['paymentStatus']
): Promise<IOrder | null> {
    return Order.findOneAndUpdate(
      { paymentReference: reference },
      { paymentStatus: status },
      { new: true }
    );
  }


  updateOrderStatus = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { status } = req.body;
    const order = await orderService.updateOrderStatus(id, status);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.status(200).json(order);
  });
}

export const orderController = new OrderController();