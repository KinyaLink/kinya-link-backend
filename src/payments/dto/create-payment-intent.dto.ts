// src/payments/dto/create-payment-intent.dto.ts
import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsDecimal,
  IsEnum,
} from 'class-validator';

export class CreatePaymentIntentDto {
  @IsNotEmpty()
  @IsString()
  user_id: string;

  @IsNotEmpty()
  @IsDecimal()
  amount: string;

  @IsNotEmpty()
  @IsString()
  currency: string;

  @IsNotEmpty()
  @IsString()
  plan: string;
}
