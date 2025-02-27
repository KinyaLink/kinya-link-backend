import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class MoMoPaymentService {
  private readonly clientId = process.env.MOMO_CLIENT_ID; // MoMo client ID
  private readonly clientSecret = process.env.MOMO_CLIENT_SECRET; // MoMo client Secret
  private readonly baseUrl = 'https://sandbox.momodeveloper.mtn.com'; // MoMo API base URL (for sandbox or live)

  private async getToken(): Promise<string> {
    const response = await axios.post(
      `${this.baseUrl}/v1_0/authorize`,
      {},
      {
        headers: {
          Authorization: `Basic ${Buffer.from(`${this.clientId}:${this.clientSecret}`).toString('base64')}`,
          'X-Reference-Id': this.generateReferenceId(),
          'X-Target-Environment': 'sandbox',
        },
      },
    );

    return response.data['access_token']; // Return the access token
  }

  private generateReferenceId(): string {
    return `ref-${Math.random().toString(36).substr(2, 9)}`; // Random reference ID generation
  }

  async initiatePayment(amount: number, userPhone: string) {
    const accessToken = await this.getToken(); // Fetch access token

    const paymentData = {
      amount: amount,
      currency: 'USD', // Adjust the currency based on your locale
      externalId: `txn-${Math.random().toString(36).substr(2, 9)}`,
      payerMessage: 'Payment for MoMo subscription',
      payeeMessage: 'Payment for MoMo subscription',
      phoneNumber: userPhone, // User's phone number to charge
    };

    const response = await axios.post(
      `${this.baseUrl}/v1_0/transfer`,
      paymentData,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'X-Reference-Id': this.generateReferenceId(),
          'X-Target-Environment': 'sandbox', // Change to 'production' for live transactions
        },
      },
    );

    return response.data;
  }

  async verifyPayment(transactionId: string) {
    const accessToken = await this.getToken(); // Fetch access token

    const response = await axios.get(
      `${this.baseUrl}/v1_0/transfer/${transactionId}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'X-Reference-Id': this.generateReferenceId(),
          'X-Target-Environment': 'sandbox',
        },
      },
    );

    return response.data;
  }
}
