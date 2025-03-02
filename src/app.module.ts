import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { TwilioService } from './twilio/twilio.service';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { SubscriptionsModule } from './subscriptions/subscriptions.module';
import { PaymentsModule } from './payments/payments.module';
import { FeaturesModule } from './features/features.module';
import { UsageModule } from './usage/usage.module';
import { TrackUsageMiddleware } from './usage/middlewares/track-usage.middleware';
import { PrismaModule } from './prisma/prisma.module';
import { AuthMiddleware } from './auth/middlewares/auth.middleware';
import { JwtModule } from '@nestjs/jwt';
@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '../..', 'uploads'),
      serveRoot: '/uploads',
    }),
    AuthModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    SubscriptionsModule,
    PaymentsModule,
    FeaturesModule,
    JwtModule,
    UsageModule,
    PrismaModule,
  ],
  controllers: [AppController],
  providers: [AppService, TwilioService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(TrackUsageMiddleware).forRoutes('*');
    consumer.apply(AuthMiddleware).forRoutes('api/admin/users');
  }
}
