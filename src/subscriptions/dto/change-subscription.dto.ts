// src/subscriptions/dto/change-subscription.dto.ts
import { IsString, IsNotEmpty, IsUUID } from 'class-validator';

export class ChangeSubscriptionDto {
  @IsNotEmpty()
  @IsString()
  user_id: string;

  @IsNotEmpty()
  @IsUUID()
  plan_id: string; // The ID of the new plan
}
