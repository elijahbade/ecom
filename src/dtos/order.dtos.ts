export interface ShippingInfoDTO {
    fullName: string;
    address: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
    phone: string;
  }
  
  export interface PaymentInitiateDTO {
    amount: number;
    email: string;
    reference?: string;
  }