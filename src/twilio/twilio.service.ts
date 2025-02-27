import { Injectable } from '@nestjs/common';
import * as twilio from 'twilio';
import * as dotenv from 'dotenv';

dotenv.config();

@Injectable()
export class TwilioService {
  private client: twilio.Twilio;

  constructor() {
    this.client = twilio(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_AUTH_TOKEN,
    );
  }

  async sendSms(to: any, message: string): Promise<string> {
    try {
      const response = await this.client.messages.create({
        body: message,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: to.phoneNumber,
      });
      return `Message sent successfully! SID: ${response.sid}`;
    } catch (error) {
      throw new Error(`Failed to send SMS: ${error.message}`);
    }
  }
}
