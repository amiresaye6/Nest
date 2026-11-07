import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { JwtGuard } from '../auth/guard';
import { Getuser } from '../auth/decorators/get-user-decorator';
import type { User } from '../generated/prisma/client';

@Controller('users')
export class UserController {
  @UseGuards(JwtGuard)
  @Get('me')
  getMe(@Getuser() user: User) {
    return user;
  }
}
