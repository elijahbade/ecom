import { Cart, ICart, ICartItem } from "../models/cart.models";
import { AddToCartDTO, UpdateCartDTO } from "../dtos/cart.dto";

class CartService {
  async getCart(userId?: string, guestId?: string): Promise<ICart | null> {
    return Cart.findOne({ $or: [{ userId }, { guestId }] });
  }

  async addToCart(
    userId: string | undefined,
    guestId: string | undefined,
    item: AddToCartDTO
  ): Promise<ICart> {
    const query = userId ? { userId } : { guestId };
    const cart = await Cart.findOneAndUpdate(
      query,
      { $push: { items: item } },
      { new: true, upsert: true }
    );
    return cart!;
  }

  async updateCartItem(
    userId: string | undefined,
    guestId: string | undefined,
    item: UpdateCartDTO
  ): Promise<ICart | null> {
    const query = userId ? { userId } : { guestId };
    return Cart.findOneAndUpdate(
      { ...query, "items.productId": item.productId },
      { $set: { "items.$.quantity": item.quantity } },
      { new: true }
    );
  }

  async removeCartItem(
    userId: string | undefined,
    guestId: string | undefined,
    productId: string
  ): Promise<ICart | null> {
    const query = userId ? { userId } : { guestId };
    return Cart.findOneAndUpdate(
      query,
      { $pull: { items: { productId } } },
      { new: true }
    );
  }

  async clearCart(userId: string | undefined, guestId: string | undefined): Promise<ICart | null> {
    const query = userId ? { userId } : { guestId };
    return Cart.findOneAndUpdate(query, { $set: { items: [] } }, { new: true });
  }

  async calculateTotals(
    userId: string | undefined,
    guestId: string | undefined
  ): Promise<{ subtotal: number; itemCount: number }> {
    const query = userId ? { userId } : { guestId };
    const cart = await Cart.findOne(query);
    if (!cart) return { subtotal: 0, itemCount: 0 };

    const subtotal = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const itemCount = cart.items.reduce((count, item) => count + item.quantity, 0);

    return { subtotal, itemCount };
  }
}

export const cartService = new CartService();
