import { ApiProperty } from '@nestjs/swagger';
import { User } from '@prisma/client';
import { Exclude } from 'class-transformer';

export class UserEntity implements User {
  constructor(partial: Partial<UserEntity> | null) {
    if (partial) {
      Object.assign(this, partial);
    }
  }

  @ApiProperty()
  id: number;

  @ApiProperty()
  email: string | null;

  @Exclude() // Exclude password from serialization
  @ApiProperty()
  password: string | null;

  @ApiProperty({ required: false })
  firstName: string | null;

  @ApiProperty({ required: false })
  lastName: string | null;

  @ApiProperty({ required: false })
  avatarUrl: string | null;

  @ApiProperty({ required: false })
  googleId: string | null;

  @ApiProperty({ required: false })
  facebookId: string | null;

  @ApiProperty({ required: false })
  provider: string | null; // 'facebook' or 'google'

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
