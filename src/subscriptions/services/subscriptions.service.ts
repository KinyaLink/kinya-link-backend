import { Injectable } from '@nestjs/common';
import { CreateSubscriptionDto } from '../dto/create-subscription.dto';
import { UpdateSubscriptionDto } from '../dto/update-subscription.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { subscribeBodyInterface } from '../interfaces/subscribe-body.interface';

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
}
