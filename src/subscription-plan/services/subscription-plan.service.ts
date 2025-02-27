import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SubscriptionPlanService {
  constructor(private prisma: PrismaService) {}

  // Retrieve all available subscription plans
  async getAllPlans() {
    return this.prisma.subscriptionPlan.findMany();
  }

  // Retrieve a specific plan by its ID
  async getPlanById(planId: string) {
    return this.prisma.subscriptionPlan.findUnique({
      where: { id: planId },
    });
  }
}
