import {
  Controller,
  ForbiddenException,
  Get,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { UsageService } from '../services/usage.service';

@Controller('translate')
export class TranslateController {
  constructor(private readonly usageService: UsageService) {}

  @Get()
  async translate(@Req() req: Request, @Query('text') text: string) {
    const userId = (req.user as any).id; // Assume user ID is available in request
    if (!userId) {
      throw new ForbiddenException('User not authenticated');
    }

    // Check and track usage
    const { planName, remaining } =
      await this.usageService.checkAndIncrementUsage(userId);

    // Perform translation (mock response for now)
    const translatedText = `Translated(${text})`;

    return {
      text,
      translatedText,
      plan: planName,
      remainingRequests: remaining,
    };
  }
}
