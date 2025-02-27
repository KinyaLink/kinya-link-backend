import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Put,
} from '@nestjs/common';
import { UsersService } from '../services/users.service';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from '../dto/create-user.dto';
import { UserEntity } from '../entities/user.entity';

@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}
  @ApiOkResponse({ type: CreateUserDto, isArray: true })
  @Get()
  async getUsers() {
    const users = this.userService.findAll();
    return (await users).map((user) => new UserEntity(user));
  }
  @Get(':id')
  async getUser(@Param('id', ParseIntPipe) id: number) {
    return new UserEntity(await this.userService.findById(id));
  }
}
