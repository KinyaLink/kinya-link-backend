// src/features/feature.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';

import { Subscription } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { PlanType } from '../enums/plan.enum';
import { SubscriptionEntity } from 'src/subscriptions/entities/subscription.entity';

@Injectable()
export class FeaturesService {
  constructor(private prisma: PrismaService) {}

  // Check if a user has access to a specific feature
  async checkFeatureAccess(userId: string, feature: string): Promise<boolean> {
    // Find the user's active subscription
    const subscription = await this.prisma.subscription.findFirst({
      where: {
        userId: parseInt(userId),
        status: 'active',
      },
      include: {
        plan: true, // Include the plan details
      },
    });

    if (!subscription) {
      throw new NotFoundException('User does not have an active subscription');
    }

    // Determine which features are accessible based on the plan
    switch (subscription.plan.name) {
      case PlanType.BASIC:
        // Basic plan access logic
        return feature === 'viewProfile'; // Only basic features are available
      case PlanType.STANDARD:
        // Standard plan access logic
        return feature === 'viewProfile' || feature === 'editProfile'; // Standard features are available
      case PlanType.PREMIUM:
        // Premium plan access logic
        return true; // All features are available
      default:
        throw new NotFoundException('Plan not found');
    }
  }
}
