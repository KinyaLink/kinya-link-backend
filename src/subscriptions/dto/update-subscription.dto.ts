import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsDate } from 'class-validator';
export class UpdateSubscriptionDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  planId?: string;

  @ApiProperty({ enum: ['active', 'inactive', 'expired'], required: false })
  @IsOptional()
  @IsString()
  status?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDate()
  startDate?: Date;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDate()
  endDate?: Date;
}
