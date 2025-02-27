import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { TwilioService } from './twilio/twilio.service';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { SubscriptionsModule } from './subscriptions/subscriptions.module';
import { PaymentsModule } from './payments/payments.module';
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
  ],
  controllers: [AppController],
  providers: [AppService, TwilioService],
})
export class AppModule {}
