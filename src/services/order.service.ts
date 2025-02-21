import { Cart } from '../models/cart.models';
import { Order, IOrder } from '../models/order.model';
import { ShippingInfoDTO, PaymentInitiateDTO } from '../dtos/order.dtos';
import { paystackService } from './paystack.service';
import { cartService } from './cart.service';
import { CartVerificationResult, ClientCartItem, IOrderItem, PriceUpdate } from '../types/cart';
import ProductModel from '../models/product/product.model';
import { Types } from 'mongoose';

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
      email: 'user@example.com', 
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

  async getAllOrders(): Promise<IOrder[]> {
    return Order.find().sort({ createdAt: -1 });
   
  }

  async getUserOrders({userId}:{userId: string}): Promise<IOrder[]> {
     
    return await Order.find({userId}).sort({ createdAt: -1 });
  }
  
async getOrderById({ _id }: { _id: string; }): Promise<IOrder | null> {
    return await Order.findById(_id);
  }

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
  async verifyCartPrices(clientCartItems: ClientCartItem[]): Promise<CartVerificationResult> {
    const verifiedItems: IOrderItem[] = [];
    let total = 0;
    let isValid = true;
    const updatedItems: PriceUpdate[] = [];

    // Fetch current prices from database for all items
    const itemIds = clientCartItems.map(item => new Types.ObjectId(item.id));
    const dbItems = await ProductModel.find({ _id: { $in: itemIds } })
      .select('_id name price')
      .lean();

    // Create a map for quick price lookup
    const dbPriceMap = new Map(
      dbItems.map(item => [item._id.toString(), { price: item.price, name: item.name }])
    );

    // Verify each item
    for (const clientItem of clientCartItems) {
      const dbItemData = dbPriceMap.get(clientItem.id);
      
      if (!dbItemData) {
        isValid = false;
        continue;
      }

      const { price: dbPrice, name } = dbItemData;
      
      // Check if price matches
      if (dbPrice !== clientItem.price) {
        isValid = false;
        updatedItems.push({
          id: clientItem.id,
          name,
          oldPrice: clientItem.price,
          newPrice: dbPrice,
          quantity: clientItem.quantity
        });
      }

      // Add to verified items with correct price and ObjectId
      verifiedItems.push({
        productId: new Types.ObjectId(clientItem.id),
        name: name,
        price: dbPrice,
        quantity: clientItem.quantity
      });

      total += dbPrice * clientItem.quantity;
    }

    return {
      isValid,
      total,
      verifiedItems,
      updatedItems: updatedItems.length > 0 ? updatedItems : null
    };
  }

}




export const orderService = new OrderService();