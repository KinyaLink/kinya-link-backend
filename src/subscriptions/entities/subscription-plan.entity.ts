import { ApiProperty } from '@nestjs/swagger';
import { SubscriptionPlan } from '@prisma/client';
import { Exclude } from 'class-transformer';

export class SubscriptionPlanEntity implements SubscriptionPlan {
  constructor(partial: Partial<SubscriptionPlanEntity> | null) {
    if (partial) {
      Object.assign(this, partial);
    }
  }

  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string; // "Basic", "Standard", "Premium"

  @ApiProperty()
  pricePerMonth: number; // Price in USD

  @ApiProperty()
  description: string; // Description of the plan

  @ApiProperty()
  createdAt: Date;
}
