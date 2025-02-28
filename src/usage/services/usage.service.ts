// src/usage/usage.service.ts
import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Usage } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UsageService {
  constructor(private prisma: PrismaService) {}

  // Get the usage statistics for a user
  async getUsageStatistics(userId: string): Promise<Usage> {
    const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM format
    const currentYear = new Date().getFullYear();

    const usage = await this.prisma.usage.findFirst({
      where: {
        userId: parseInt(userId),
        month: currentMonth,
        year: currentYear,
      },
    });

    if (!usage) {
      throw new NotFoundException('Usage record not found for this user');
    }

    return usage;
  }
  async checkAndIncrementUsage(userId: number) {
    // Get the user's subscription plan
    const subscription = await this.prisma.subscription.findFirst({
      where: { userId },
      include: { plan: true },
    });

    if (!subscription) {
      throw new ForbiddenException('User has no active subscription');
    }

    const planName = subscription.plan.name.toLowerCase();
    const maxRequests = planName === 'free' ? 50 : Infinity;

    // Get today's usage record
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let usage = await this.prisma.usage.findFirst({
      where: {
        userId,
        date: today,
      },
    });

    if (!usage) {
      usage = await this.prisma.usage.create({
        data: {
          userId,
          callsMade: 0,
          date: today,
        },
      });
    }

    // Enforce request limit
    if (planName === 'free' && usage.callsMade >= maxRequests) {
      throw new ForbiddenException('Daily translation limit reached');
    }

    // Increment the API call count
    await this.prisma.usage.update({
      where: { id: usage.id },
      data: { callsMade: usage.callsMade + 1 },
    });

    return { planName, remaining: maxRequests - (usage.callsMade + 1) };
  }
}
