import { IsString, IsNotEmpty } from 'class-validator';

export class CancelSubscriptionDto {
  @IsNotEmpty()
  @IsString()
  subscription_id: string;
}
