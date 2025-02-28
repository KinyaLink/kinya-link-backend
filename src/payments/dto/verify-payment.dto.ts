// src/payments/dto/verify-payment.dto.ts
import { IsString, IsNotEmpty } from 'class-validator';

export class VerifyPaymentDto {
  @IsNotEmpty()
  @IsString()
  payment_intent_id: string;

  @IsNotEmpty()
  @IsString()
  user_id: string;
}
