import { Module } from '@nestjs/common';
import { UsersService } from './services/users.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UsersController } from './controllers/users.controller';
import { UserEntity } from './entities/user.entity';
import { TwilioService } from 'src/twilio/twilio.service';
import { AdminController } from './controllers/admin.controller';

@Module({
  providers: [UsersService, UserEntity, TwilioService],
  exports: [UsersService],
  imports: [PrismaModule],
  controllers: [UsersController, AdminController],
})
export class UsersModule {}
