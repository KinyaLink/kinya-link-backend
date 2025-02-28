import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { CreateSubscriptionDto } from '../dto/create-subscription.dto';
import { UpdateSubscriptionDto } from '../dto/update-subscription.dto';
import { SubscriptionsService } from '../services/subscriptions.service';
import { subscribeBodyInterface } from '../interfaces/subscribe-body.interface';
import { CancelSubscriptionDto } from '../dto/cancel-subscription.dto';
import { CheckSubscriptionDto } from '../dto/check-subscription.dto';

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
  @Post('cancel')
  async cancel(@Body() cancelSubscriptionDto: CancelSubscriptionDto) {
    return this.subscriptionsService.cancelSubscription(cancelSubscriptionDto);
  }
  @Get('status')
  async checkStatus(@Query() checkSubscriptionDto: CheckSubscriptionDto) {
    return this.subscriptionsService.checkSubscriptionStatus(
      checkSubscriptionDto,
    );
  }
}
