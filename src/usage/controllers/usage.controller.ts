import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { CreateUsageDto } from '../dto/create-usage.dto';
import { UpdateUsageDto } from '../dto/update-usage.dto';
import { UsageService } from '../services/usage.service';
import { Usage } from '@prisma/client';

@Controller('usage')
export class UsageController {
  constructor(private readonly usageService: UsageService) {}
  @Get(':userId')
  async getUsage(@Param('userId') userId: string): Promise<Usage> {
    return this.usageService.getUsageStatistics(userId);
  }
}
