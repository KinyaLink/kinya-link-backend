import { ApiProperty } from '@nestjs/swagger';
import { Subscription } from '@prisma/client';
import { Exclude } from 'class-transformer';

export class SubscriptionEntity implements Subscription {
  constructor(partial: Partial<SubscriptionEntity> | null) {
    if (partial) {
      Object.assign(this, partial);
    }
  }

  @ApiProperty()
  id: string;

  @ApiProperty()
  userId: number;

  @ApiProperty()
  planId: string;

  @ApiProperty({ enum: ['active', 'inactive', 'expired'] })
  status: string;

  @ApiProperty()
  startDate: Date;

  @ApiProperty({ required: false })
  endDate: Date | null;
}
