import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateSubscriptionDto } from '../dto/create-subscription.dto';
import { UpdateSubscriptionDto } from '../dto/update-subscription.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { subscribeBodyInterface } from '../interfaces/subscribe-body.interface';
import { CancelSubscriptionDto } from '../dto/cancel-subscription.dto';
import { CheckSubscriptionDto } from '../dto/check-subscription.dto';
import { ChangeSubscriptionDto } from '../dto/change-subscription.dto';

@Injectable()
export class SubscriptionsService {
  constructor(private prisma: PrismaService) {}
  async getPlans() {
    return this.prisma.subscriptionPlan.findMany();
  }
  async subscribe(createSubscriptionBody: subscribeBodyInterface) {
    const { plan, paymentMethod, userId } = createSubscriptionBody;

    const user = await this.prisma.user.findUnique({
      where: { id: Number(userId) },
    });
    if (!user) {
      throw new Error('User not found');
    }

    const subscriptionPlan = await this.prisma.subscriptionPlan.findFirst({
      where: { name: plan },
    });
    if (!subscriptionPlan) {
      throw new Error('Plan not found');
    }

    const subscription = await this.prisma.subscription.create({
      data: {
        userId: user.id,
        planId: subscriptionPlan.id,
        status: 'active',
      },
    });

    return subscription;
  }
  async cancelSubscription(cancelSubscriptionDto: CancelSubscriptionDto) {
    const { subscription_id } = cancelSubscriptionDto;

    const subscription = await this.prisma.subscription.findUnique({
      where: { id: subscription_id },
    });

    if (!subscription) {
      throw new Error('Subscription not found');
    }

    const updatedSubscription = await this.prisma.subscription.update({
      where: { id: subscription_id },
      data: {
        status: 'inactive',
        endDate: new Date(),
      },
    });

    return updatedSubscription;
  }
  async checkSubscriptionStatus(checkSubscriptionDto: CheckSubscriptionDto) {
    const { user_id } = checkSubscriptionDto;

    // Find the most recent active subscription for the user
    const subscription = await this.prisma.subscription.findFirst({
      where: {
        userId: parseInt(user_id),
        status: 'active',
      },
      orderBy: {
        startDate: 'desc', // Get the most recent subscription
      },
    });

    if (!subscription) {
      throw new Error('No active subscription found');
    }

    return {
      planId: subscription.planId,
      status: subscription.status,
      startDate: subscription.startDate,
      endDate: subscription.endDate || null,
    };
  }
  async changeSubscriptionPlan(changeSubscriptionDto: ChangeSubscriptionDto) {
    const { user_id, plan_id } = changeSubscriptionDto;

    // Fetch the user's current active subscription
    const currentSubscription = await this.prisma.subscription.findFirst({
      where: {
        userId: parseInt(user_id),
        status: 'active',
      },
      orderBy: {
        startDate: 'desc', // Get the most recent active subscription
      },
    });

    if (!currentSubscription) {
      throw new NotFoundException('No active subscription found for this user');
    }

    // Fetch the new plan the user wants to switch to
    const newPlan = await this.prisma.subscriptionPlan.findUnique({
      where: { id: plan_id },
    });

    if (!newPlan) {
      throw new NotFoundException('The selected plan does not exist');
    }

    // Check if the user is already on the selected plan
    if (currentSubscription.planId === plan_id) {
      throw new BadRequestException('You are already subscribed to this plan');
    }

    // Update the subscription
    const updatedSubscription = await this.prisma.subscription.update({
      where: { id: currentSubscription.id },
      data: {
        planId: plan_id,
        status: 'inactive', // Deactivate the old subscription
        endDate: new Date(), // End the current subscription immediately
      },
    });

    // Create a new subscription with the new plan
    const newSubscription = await this.prisma.subscription.create({
      data: {
        userId: parseInt(user_id),
        planId: plan_id,
        status: 'active',
        startDate: new Date(),
      },
    });

    return {
      message: 'Subscription changed successfully',
      oldSubscription: updatedSubscription,
      newSubscription: newSubscription,
    };
  }
}
