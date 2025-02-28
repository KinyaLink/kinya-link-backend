// src/subscriptions/dto/check-subscription.dto.ts
import { IsString, IsNotEmpty } from 'class-validator';

export class CheckSubscriptionDto {
  @IsNotEmpty()
  @IsString()
  user_id: string;
}
