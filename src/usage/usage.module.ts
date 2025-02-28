import { Module } from '@nestjs/common';
import { UsageController } from './controllers/usage.controller';
import { UsageService } from './services/usage.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { TranslateController } from './controllers/translate.controller';

@Module({
  imports: [PrismaModule],
  controllers: [UsageController, TranslateController],
  providers: [UsageService],
})
export class UsageModule {}
