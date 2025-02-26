import { Module } from '@nestjs/common';
import { UsersService } from './services/users.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UsersController } from './controllers/users.controller';
import { UserEntity } from './entities/user.entity';

@Module({
  providers: [UsersService, UserEntity],
  exports: [UsersService],
  imports: [PrismaModule],
  controllers: [UsersController],
})
export class UsersModule {}
