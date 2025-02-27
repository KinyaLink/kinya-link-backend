import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/services/users.service';
import { JwtService } from '@nestjs/jwt';
import { PrismaClient, User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UserEntity } from 'src/users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
    private prisma: PrismaService,
    private createUserDto: CreateUserDto,
  ) {}
  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userService.findOne(email);
    if (user && user.password === password) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }
  async login(user: any) {
    const payload = { email: user.email, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
  signup(createUserDto: CreateUserDto) {
    return this.prisma.user.create({ data: createUserDto });
  }
  async validateGoogleUser(profile: any) {
    let user = await this.userService.findByGoogleId(profile.googleId);

    if (!user) {
      const newUser: CreateUserDto = {
        firstName: profile.name.givenName,
        lastName: profile.name.familyName,
        avatarUrl: profile.photos[0].value,
        email: profile.emails[0].value,
        googleId: profile.id,
      };
      user = await this.userService.createUser(newUser);
    }

    const payload = { userId: user.id, email: user.email };
    return {
      user,
      accessToken: this.jwtService.sign(payload),
    };
  }
}
