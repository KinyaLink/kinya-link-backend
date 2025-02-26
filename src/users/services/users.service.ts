import { Injectable } from '@nestjs/common';
import { CreateUserDto } from '../dto/create-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
export type User = any;
@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findOne(firstName: string): Promise<User | undefined> {
    return this.prisma.user.findFirst({ where: { firstName } });
  }
  async findAll() {
    return this.prisma.user.findMany();
  }
  async findById(id: number) {
    return this.prisma.user.findUnique({ where: { id } });
  }
}
