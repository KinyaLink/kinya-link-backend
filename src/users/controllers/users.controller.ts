import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UseInterceptors,
  UploadedFile,
  Patch,
  Delete,
} from '@nestjs/common';
import { UsersService } from '../services/users.service';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from '../dto/create-user.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { UserEntity } from '../entities/user.entity';
import { multerConfig } from 'src/config/multer.config';
import { Express } from 'express';
import { UpdateUserDto } from '../dto/update-user.dto';

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
  @Patch('add/phoneNumber/:id')
  async updatePhoneNumber(
    @Body() phoneNumber: string,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.userService.addPhoneNumber(phoneNumber, id);
  }
  @Patch('profile/:id')
  async updateProfile(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.userService.updateProfile(updateUserDto, id);
  }
  @Patch('profile/picture/:id')
  @UseInterceptors(FileInterceptor('image', multerConfig))
  async updateProfilePicture(
    @UploadedFile() image: any,
    @Param('id', ParseIntPipe) id: number,
  ) {
    const imagePath = image ? image.path : null;
    return this.userService.updateProfilePicture(imagePath, id);
  }
  @Delete('delete/:id')
  async deleteUser(@Param('id', ParseIntPipe) id: number) {
    return this.userService.deleteUser(id);
  }
}
