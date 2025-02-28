// src/payments/payment.service.ts
import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import Stripe from 'stripe';
import { CreatePaymentIntentDto } from '../dto/create-payment-intent.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { VerifyPaymentDto } from '../dto/verify-payment.dto';

@Injectable()
export class PaymentsService {
  private stripe: Stripe;

  constructor(private prisma: PrismaService) {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
      apiVersion: '2025-02-24.acacia',
    });
  }

  // Create a Payment Intent for processing payments
  async createPaymentIntent(createPaymentIntentDto: CreatePaymentIntentDto) {
    const { user_id, amount, currency, plan } = createPaymentIntentDto;

    // Validate the user's subscription plan, check if the plan exists (this could be a Prisma check if plans are in the DB)
    const validPlans = ['basic', 'standard', 'premium']; // This should be dynamic depending on your plans

    if (!validPlans.includes(plan)) {
      throw new BadRequestException('Invalid subscription plan');
    }

    try {
      // Create a payment intent with Stripe
      const paymentIntent = await this.stripe.paymentIntents.create({
        amount: parseFloat(amount) * 100, // Amount should be in cents
        currency: currency,
        metadata: {
          user_id,
          plan,
        },
      });

      return {
        clientSecret: paymentIntent.client_secret, // Send client secret to frontend
        paymentIntentId: paymentIntent.id,
      };
    } catch (error) {
      throw new BadRequestException('Error creating payment intent');
    }
  }
  async verifyPayment(verifyPaymentDto: VerifyPaymentDto) {
    const { payment_intent_id, user_id } = verifyPaymentDto;

    try {
      // Retrieve the payment intent from Stripe
      const paymentIntent =
        await this.stripe.paymentIntents.retrieve(payment_intent_id);

      // Check if the payment status is successful
      if (paymentIntent.status === 'succeeded') {
        // Update the user's subscription status to reflect the upgrade
        await this.upgradeUserSubscription(user_id, paymentIntent);

        return {
          message: 'Payment verified successfully, subscription upgraded.',
        };
      } else {
        throw new BadRequestException('Payment failed or not completed.');
      }
    } catch (error) {
      throw new NotFoundException('Payment intent not found or invalid.');
    }
  }

  // Upgrade user subscription (or handle any business logic you need)
  private async upgradeUserSubscription(
    user_id: string,
    paymentIntent: Stripe.PaymentIntent,
  ) {
    // Business logic to upgrade the user's subscription
    // For example, you might check the user's current subscription plan and upgrade it
    const user = await this.prisma.user.findUnique({
      where: { id: parseInt(user_id) },
      include: { subscriptions: true },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const currentPlan = paymentIntent.metadata.plan; // Assuming the plan is stored in metadata
    const existingSubscription = user.subscriptions.find(
      (subscription) => subscription.status === currentPlan,
    );

    if (existingSubscription) {
      throw new BadRequestException('User already has this plan.');
    }

    // Update the user's subscription to the new plan
    await this.prisma.subscription.create({
      data: {
        userId: user.id,
        planId: currentPlan, // Plan ID should be fetched based on the plan name or passed data
        status: 'active',
      },
    });

    // Additional business logic, like sending a confirmation email, etc.
  }
  async fetchBillingHistory(userId: string) {
    // Find the user by userId (make sure the user exists)
    const user = await this.prisma.user.findUnique({
      where: { id: parseInt(userId) },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    try {
      // Fetch the user's Stripe customer ID (assuming it's stored in the user model)
      const stripeCustomerId = user.stripeCustomerId;

      if (!stripeCustomerId) {
        throw new NotFoundException(
          'Stripe customer ID not found for the user',
        );
      }

      // Retrieve invoices from Stripe
      const invoices = await this.stripe.invoices.list({
        customer: stripeCustomerId,
        limit: 10, // Limit the number of invoices retrieved
      });

      // Return the list of invoices
      return invoices;
    } catch (error) {
      throw new NotFoundException('Error fetching billing history');
    }
  }
}
