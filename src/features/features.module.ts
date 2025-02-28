import { Module } from '@nestjs/common';
import { FeaturesController } from './controllers/features.controller';
import { FeaturesService } from './services/features.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { SubscriptionsModule } from 'src/subscriptions/subscriptions.module';

@Module({
  imports: [PrismaModule, SubscriptionsModule],
  controllers: [FeaturesController],
  providers: [FeaturesService],
})
export class FeaturesModule {}
