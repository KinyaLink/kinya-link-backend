import { Injectable } from '@nestjs/common';
import Stripe from 'stripe';
import { SubscriptionPlanService } from '../subscription-plan/subscription-plan.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class PaymentService {
  private stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
    apiVersion: '2025-02-24.acacia',
  });

  constructor(
    private prisma: PrismaService,
    private subscriptionPlanService: SubscriptionPlanService,
  ) {}

  async createSubscription(userId: string, token: string, planId: string) {
    // Retrieve the selected plan
    const plan = await this.subscriptionPlanService.getPlanById(planId);

    // Create Stripe customer
    const customer = await this.stripe.customers.create({
      email: userId,
      source: token,
    });

    // Create a subscription for the user
    const subscription = await this.stripe.subscriptions.create({
      customer: customer.id,
      items: [
        {
          price_data: {
            currency: 'usd',
            product_data: { name: plan.name },
            unit_amount: plan.pricePerMonth * 100,
          },
        },
      ],
      expand: ['latest_invoice.payment_intent'],
    });

    // Save the subscription details to the database
    await this.prisma.subscription.create({
      data: {
        userId,
        planId: plan.id,
        status: 'active',
        startDate: new Date(),
        endDate: this.calculateEndDate(plan),
      },
    });

    return subscription;
  }

  private calculateEndDate(plan: any): Date {
    const today = new Date();
    if (plan.name === 'Basic')
      return new Date(today.setMonth(today.getMonth() + 1)); // For monthly plans
    if (plan.name === 'Standard' || plan.name === 'Premium')
      return new Date(today.setMonth(today.getMonth() + 1)); // Monthly renewals
    return today;
  }
}
