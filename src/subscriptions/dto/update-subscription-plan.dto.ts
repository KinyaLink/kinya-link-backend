import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsNumber } from 'class-validator';

export class UpdateSubscriptionPlanDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  pricePerMonth?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  description?: string;
}
