import { Controller, Post, Body, Req, UseGuards } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('subscriptions')
export class SubscriptionController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post('/upgrade')
  @UseGuards(JwtAuthGuard)
  async upgradeSubscription(@Req() req, @Body() { planId, token }) {
    const user = req.user; // Extract user from JWT token
    const subscription = await this.paymentService.createSubscription(
      user.id,
      token,
      planId,
    );

    return { message: 'Subscription upgraded successfully!', subscription };
  }
  // Handle MoMo payment request (for subscription upgrade)
  @Post('/momo/upgrade')
  @UseGuards(JwtAuthGuard)
  async upgradeWithMoMo(@Req() req, @Body() { amount, phoneNumber }) {
    const user = req.user; // Get the logged-in user
    const paymentResult = await this.momoPaymentService.initiatePayment(
      amount,
      phoneNumber,
    );

    // Save the transaction data or notify user about the payment link
    return {
      message: 'Payment initiated with MoMo',
      paymentDetails: paymentResult,
    };
  }

  // Handle MoMo payment verification
  @Post('/momo/verify')
  @UseGuards(JwtAuthGuard)
  async verifyMoMoPayment(@Req() req, @Body() { transactionId }) {
    const paymentStatus =
      await this.momoPaymentService.verifyPayment(transactionId);

    if (paymentStatus.status === 'successful') {
      // Update the user's subscription status to 'active'
      const user = req.user;
      const planId = req.body.planId; // Plan user has chosen

      // Save subscription details in the database (same as Stripe)
      await this.paymentService.createSubscription(
        user.id,
        transactionId,
        planId,
      );

      return { message: 'Subscription upgraded successfully via MoMo!' };
    }

    return { message: 'Payment failed. Please try again.' };
  }
}
