import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { CreateSubscriptionDto } from '../dto/create-subscription.dto';
import { UpdateSubscriptionDto } from '../dto/update-subscription.dto';
import { SubscriptionsService } from '../services/subscriptions.service';
import { subscribeBodyInterface } from '../interfaces/subscribe-body.interface';

@Controller('subscriptions')
export class SubscriptionsController {
  constructor(private readonly subscriptionsService: SubscriptionsService) {}
  @Get('plans')
  async getPlans() {
    return await this.subscriptionsService.getPlans();
  }
  //not done with payment stuff on subscribing
  @Post('subscribe')
  async subscribePlan(
    @Body() { plan, paymentMethod, userId }: subscribeBodyInterface,
  ) {
    return this.subscriptionsService.subscribe({ plan, paymentMethod, userId });
  }
}
