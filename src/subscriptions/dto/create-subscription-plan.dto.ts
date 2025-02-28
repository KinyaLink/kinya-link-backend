import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsNumber } from 'class-validator';

export class CreateSubscriptionPlanDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string; // "Basic", "Standard", "Premium"

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  pricePerMonth: number; // Price in USD

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  description: string; // Description of the plan
}
