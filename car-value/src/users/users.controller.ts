import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Patch,
  Query,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dtos/update-user.dto';
import { SerializeInterceptor } from 'src/interceptors/serialize.interceptor';

@Controller('auth')
export class UsersController {
  constructor(private userService: UsersService) {}
  @Post('/signup')
  createUser(@Body() body: CreateUserDto) {
    this.userService.create(body.email, body.password);
  }

  @UseInterceptors(SerializeInterceptor)
  @Get('/users/:id')
  findUser(@Param('id') id: string) {
    // any value from the url will be streing, so you need to make sure to convert any numbers you want to pass.
    return this.userService.findOne(+id);
  }

  @Get('/users')
  findAllUsers(@Query('email') email: string) {
    return this.userService.find(email);
  }

  @Patch('/users/:id')
  updateUser(@Param('id') id: string, @Body() body: UpdateUserDto) {
    return this.userService.update(+id, body);
  }

  @Delete('/users/:id')
  deleteUser(@Param('id') id: string) {
    return this.userService.delete(+id);
  }
}
