export interface AddToCartDTO {
    productId: string;
    name: string;
    price: number;
    quantity: number;
  }
  
  export interface UpdateCartDTO {
    productId: string;
    quantity: number;
  }
  