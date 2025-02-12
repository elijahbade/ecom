import { IOrderItem } from "../models/order.model";


  export interface ClientCartItem {
    id: string;
    name: string;
    price: number;
    quantity: number;
  }
  
  // Interface for price updates
  export interface PriceUpdate {
    id: string;
    name: string;
    oldPrice: number;
    newPrice: number;
    quantity: number;
  }
  
  // Main verification response interface
  export interface CartVerificationResult {
    isValid: boolean;
    total: number;
    verifiedItems: IOrderItem[];  // Using IOrderItem instead of BaseCartItem
    updatedItems: PriceUpdate[] | null;
  }

export { IOrderItem };
