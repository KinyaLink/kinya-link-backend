import { Controller, Get, UseGuards } from '@nestjs/common';
import { AdminGuard } from '../guards/admin.guard';
import { UsersService } from '../services/users.service';

@Controller('admin')
export class AdminController {
  constructor(private readonly userService: UsersService) {}

  @Get('users')
  @UseGuards(AdminGuard) // Restrict to admin users
  async getAllUsers() {
    return await this.userService.getAllUsersWithSubscriptions();
  }
}
