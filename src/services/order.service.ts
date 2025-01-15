import { Cart } from '../models/cart.models';
import { Order, IOrder } from '../models/order.model';
import { ShippingInfoDTO, PaymentInitiateDTO } from '../dtos/order.dtos';
import { paystackService } from './paystack.service';
import { cartService } from './cart.service';

class OrderService {
  async saveShippingInfo(userId: string, shippingInfo: ShippingInfoDTO): Promise<void> {
    // Store shipping info in session or local storage wihtin the browser
    // Implementation depends on the  session management strategy I choose
  }

  async initiatePayment(userId: string): Promise<any> {
    const { subtotal } = await cartService.calculateTotals(userId);
    const cart = await cartService.getCart(userId);
    
    if (!cart || cart.items.length === 0) {
      throw new Error('Cart is empty');
    }

    const paymentData: PaymentInitiateDTO = {
      amount: subtotal,
      email: 'user@example.com', // Get from user session/profile
      reference: `ORDER_${Date.now()}_${userId}`
    };

    return paystackService.initiatePayment(paymentData);
  }

  async createOrder(
    userId: string, 
    shippingInfo: ShippingInfoDTO, 
    paymentReference: string
  ): Promise<IOrder> {
    const cart = await cartService.getCart(userId);
    if (!cart) throw new Error('Cart not found');

    const { subtotal } = await cartService.calculateTotals(userId);

    const order = await Order.create({
      userId,
      items: cart.items,
      shippingInfo,
      totalAmount: subtotal,
      paymentReference,
      paymentStatus: 'pending'
    });

    // Clear the cart after order creation
    await cartService.clearCart(userId);

    return order;
  }

  async getOrderHistory(userId: string): Promise<IOrder[]> {
    return Order.find({ userId }).sort({ createdAt: -1 });
  }

  async getOrderById(orderId: string): Promise<IOrder | null> {
    return Order.findById(orderId);
  }

  async updateOrderStatus(
    orderId: string, 
    status: IOrder['orderStatus']
  ): Promise<IOrder | null> {
    return Order.findByIdAndUpdate(
      orderId,
      { orderStatus: status },
      { new: true }
    );
  }
}

export const orderService = new OrderService();