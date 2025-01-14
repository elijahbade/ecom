import { Cart, ICart } from "../models/cart.models";
import ProductModel from "../models/product/product.model";
import { AddToCartDTO, UpdateCartDTO } from "../dtos/cart.dto";

class CartService {
  async getCart(userId: string): Promise<ICart | null> {
    return Cart.findOne({ userId });
  }


  async addToCart(userId: string, item: AddToCartDTO): Promise<ICart> {
    const product = await ProductModel.findById(item.productId);
    if (!product) {
      throw new Error("Product not found");
    }
  
    // Find the user's cart
    const cart = await Cart.findOne({ userId });
  
    if (cart) {
      // Check if the item already exists in the cart
      const existingItem = cart.items.find(
        (cartItem) => cartItem.productId.toString() === item.productId
      );
  
      if (existingItem) {
        // Increment the quantity if the item exists
        const additionalQuantity = Number(item.quantity) || 1; // Convert to number and default to 1
        existingItem.quantity += additionalQuantity;
      } else {
        // Add a new item to the cart
        cart.items.push({
          productId: item.productId,
          quantity: Number(item.quantity) || 1, // Convert to number and default to 1
          name: product.name,
          price: product.price,
        });
      }
  
      // Save the updated cart
      await cart.save();
      return cart;
    }
  
    // If no cart exists, create a new one
    const newCart = await Cart.create({
      userId,
      items: [
        {
          productId: item.productId,
          quantity: Number(item.quantity) || 1, // Convert to number and default to 1
          name: product.name,
          price: product.price,
        },
      ],
    });
    return newCart;
  }
  

  async updateCartItem(userId: string, item: UpdateCartDTO): Promise<ICart | null> {
    return Cart.findOneAndUpdate(
      { userId, "items.productId": item.productId },
      { $set: { "items.$.quantity": item.quantity } },
      { new: true }
    );
  }

  async removeCartItem(userId: string, productId: string): Promise<ICart | null> {
    return Cart.findOneAndUpdate(
      { userId },
      { $pull: { items: { productId } } },
      { new: true }
    );
  }

  async clearCart(userId: string): Promise<ICart | null> {
    return Cart.findOneAndUpdate({ userId }, { $set: { items: [] } }, { new: true });
  }

  async calculateTotals(userId: string): Promise<{ subtotal: number; itemCount: number }> {
    const cart = await Cart.findOne({ userId });

    if (!cart) return { subtotal: 0, itemCount: 0 };

    const subtotal = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const itemCount = cart.items.reduce((count, item) => count + item.quantity, 0);

    return { subtotal, itemCount };
  }
}

export const cartService = new CartService();
