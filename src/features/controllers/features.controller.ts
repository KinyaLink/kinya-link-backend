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
import { CreateFeatureDto } from '../dto/create-feature.dto';
import { UpdateFeatureDto } from '../dto/update-feature.dto';
import { FeaturesService } from '../services/features.service';

@Controller('features')
export class FeaturesController {
  constructor(private readonly featuresService: FeaturesService) {}
  @Get('check')
  async checkFeatureAccess(
    @Query('userId') userId: string,
    @Query('feature') feature: string,
  ) {
    return this.featuresService.checkFeatureAccess(userId, feature);
  }
}
