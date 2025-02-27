import { Injectable } from '@nestjs/common';
import { CreateUserDto } from '../dto/create-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { User } from '@prisma/client';
@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findOne(email: string): Promise<User | null> {
    return this.prisma.user.findFirst({ where: { email } });
  }
  async findAll() {
    return this.prisma.user.findMany();
  }
  async findById(id: number) {
    return this.prisma.user.findUnique({ where: { id } });
  }
  async findByGoogleId(googleId: string): Promise<User | null> {
    return this.prisma.user.findFirst({ where: { googleId } });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findFirst({ where: { email } });
  }

  async createUser(userData: Partial<User>): Promise<User> {
    const user = this.prisma.user.create({
      data: {
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        googleId: userData.googleId,
        avatarUrl: userData.avatarUrl,
        provider: 'google',
      },
    });
    return user;
  }
}
