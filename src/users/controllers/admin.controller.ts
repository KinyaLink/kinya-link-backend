import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AdminGuard } from '../guards/admin.guard';
import { UsersService } from '../services/users.service';
import { CreateSubscriptionPlanDto } from 'src/subscriptions/dto/create-subscription-plan.dto';

@Controller('admin')
export class AdminController {
  constructor(private readonly userService: UsersService) {}

  @Get('users')
  @UseGuards(AdminGuard) // Restrict to admin users
  async getAllUsers() {
    return await this.userService.getAllUsersWithSubscriptions();
  }
  @Post('subscriptions/add')
  @UseGuards(AdminGuard) // Restrict to admins
  async addSubscriptionPlan(@Body() dto: CreateSubscriptionPlanDto) {
    return await this.userService.addSubscriptionPlan(dto);
  }
  @Delete('subscriptions/delete/:plan_id')
  @UseGuards(AdminGuard) // Restrict to admins
  async deleteSubscriptionPlan(@Param('plan_id') planId: string) {
    return await this.userService.deleteSubscriptionPlan(planId);
  }
}
