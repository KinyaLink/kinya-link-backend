import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsDate } from 'class-validator';
export class CreateSubscriptionDto {
  @ApiProperty()
  @IsNotEmpty()
  userId: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  planId: string;

  @ApiProperty({ enum: ['active', 'inactive', 'expired'] })
  @IsString()
  @IsNotEmpty()
  status: string;

  @ApiProperty({ required: false, default: new Date() })
  @IsOptional()
  @IsDate()
  startDate?: Date;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDate()
  endDate?: Date;
}
