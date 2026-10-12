import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuthDto } from './dto';
import * as argon from 'argon2';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}
  async signup(body: AuthDto) {
    const hash = await argon.hash(body.password);

    const user = await this.prisma.user.create({
      data: {
        email: body.email,
        hash,
      },
    });
    return { message: ' User signed up successfully', user };
  }

  signin() {
    return { msg: ' i signed up successfully' };
  }
}
