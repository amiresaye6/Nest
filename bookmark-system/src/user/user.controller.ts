import { Controller, Get, Patch, Req, UseGuards } from '@nestjs/common';
import { JwtGuard } from '../auth/guard';
import { Getuser } from '../auth/decorators/get-user-decorator';
import type { User } from '../generated/prisma/client';
import { UserService } from './user.service';
import { EditUserDto } from './dto';

@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}
  @UseGuards(JwtGuard)
  @Get('me')
  getMe(@Getuser() user: User) {
    return user;
  }

  @Patch()
  editUser(@Getuser() user: User, dto: EditUserDto) {
    return this.userService.editUser(user.id, dto);
  }
}
