import axios from 'axios';
import { PaymentInitiateDTO } from '../dtos/order.dtos';
import dotenv from 'dotenv';
import path from 'path';



dotenv.config({ path: path.join(__dirname, '../../.env') });



class PaystackService {
  private readonly baseUrl = 'https://api.paystack.co';
  private readonly secretKey: string;

  constructor() 
  
{
    this.secretKey = process.env.PAYSTACK_SECRET_KEY!;
  }

  

  async initiatePayment(data: PaymentInitiateDTO) {
    try {


      const response = await axios.post(
        `${this.baseUrl}/transaction/initialize`,
        {
          amount: data.amount * 100, 
          email: data.email,
          reference: data.reference
        },
        {
          headers: {
            Authorization: `Bearer ${this.secretKey}`,
            'Content-Type': 'application/json'
          }
        }
      );
    
    return response.data;
    }
      catch (error: any) {
        // Detailed error logging
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          console.error('Paystack API Error:', {
            status: error.response.status,
            statusText: error.response.statusText,
            data: error.response.data,
            headers: error.response.headers
          });
          throw new Error(`Paystack API Error: ${error.response.data.message || error.response.statusText}`);
        } else if (error.request) {
          // The request was made but no response was received
          console.error('Paystack No Response:', error.request);
          throw new Error('No response received from Paystack');
        } else {
          // Something happened in setting up the request that triggered an Error
          console.error('Paystack Setup Error:', error.message);
          throw new Error(`Payment setup failed: ${error.message}`);
        }
      }
    }

  async verifyPayment(reference: string) {
    try {
      const response = await axios.get(
        `${this.baseUrl}/transaction/verify/${reference}`,
        {
          headers: {
            Authorization: `Bearer ${this.secretKey}`
          }
        }
      );
      return response.data;
    } catch (error) {
      throw new Error('Payment verification failed');
    }
  }
}

export const paystackService = new PaystackService();