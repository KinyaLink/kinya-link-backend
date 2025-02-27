import { Controller, Get } from '@nestjs/common';
import { SubscriptionPlanService } from './subscription-plan.service';

@Controller('plans')
export class SubscriptionPlanController {
  constructor(
    private readonly subscriptionPlanService: SubscriptionPlanService,
  ) {}

  @Get('/')
  async getAllPlans() {
    return this.subscriptionPlanService.getAllPlans();
  }
}
