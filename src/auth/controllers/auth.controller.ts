import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Req,
  Request,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { LocalAuthGuard } from '../guards/local-auth.guard';
import { AuthService } from '../services/auth.service';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
} from '@nestjs/swagger';
import {
  LoginBodyDto,
  LoginResponseDto,
  logoutBadResponseDto,
  logoutResponseDto,
} from '../dto/auth.dto';
import { UserEntity } from 'src/users/entities/user.entity';
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @UseGuards(LocalAuthGuard)
  @ApiCreatedResponse({ type: LoginResponseDto })
  @ApiBody({ type: LoginBodyDto })
  @Post('login')
  async login(@Request() req) {
    const token = await this.authService.login(req.user);
    return token;
  }
  @UseGuards(LocalAuthGuard)
  @ApiOkResponse({ type: logoutResponseDto })
  @ApiBadRequestResponse({ type: logoutBadResponseDto })
  @Post('logout')
  async logout(@Req() req, @Res() res) {
    req.logout((err) => {
      if (err) {
        console.error('Error during logout:', err);
        return res
          .status(HttpStatus.INTERNAL_SERVER_ERROR)
          .json({ message: 'Logout failed' });
      }

      res.status(HttpStatus.OK).json({ message: 'Logout successful' });
    });
  }
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({ type: UserEntity })
  @Get('profile')
  async getProfile(@Request() req) {
    return req.user;
  }
  @Post('signup')
  @ApiCreatedResponse({ type: UserEntity })
  @ApiBody({ type: CreateUserDto })
  async signup(@Body() createUserDto: CreateUserDto) {
    return new UserEntity(await this.authService.signup(createUserDto));
  }
}
