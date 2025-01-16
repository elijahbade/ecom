import axios from 'axios';
import { PaymentInitiateDTO } from '../dtos/order.dtos';
import dotenv from 'dotenv';
import path from 'path';
import { orderService } from './order.service';
import crypto from 'crypto';


dotenv.config({ path: path.join(__dirname, '../../.env') });



class PaystackService {
  private readonly baseUrl = 'https://api.paystack.co';
  private readonly secretKey: string;


  constructor() {
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

  verifySignature(payload: any, signature: string | string[] | undefined): boolean {
    if (!signature) return false; {

    const secret = this.secretKey;
    const hash = crypto.createHmac('sha512', secret).update(JSON.stringify(payload)).digest('hex');
    return hash === signature;
  }
}

  

  async handleWebhookEvent(webhookData: any): Promise<void> {
    const { event, data } = webhookData;
    if (event === 'charge.success') {
      const reference = data.reference;

      // Update transaction status in the database
      const updatedOrder = await orderService.updateOrderPaymentStatus(reference, 'paid');

      if (updatedOrder) {
        // Send payment confirmation email
        console.log(`Payment confirmed for reference: ${reference}`);
        // Add email sending logic here
      } else {
        console.error(`Order with reference ${reference} not found`);
      }
    } else {
      console.log(`Unhandled webhook event: ${event}`);
    }
  }




}

export const paystackService = new PaystackService();




