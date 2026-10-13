import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuthDto } from './dto';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/client';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}
  async signup(body: AuthDto) {
    try {
      const hash = await argon.hash(body.password);

      const user = await this.prisma.user.create({
        data: {
          email: body.email,
          hash,
        },
      });
      return {
        message: ' User signed up successfully',
        user: {
          email: user.email,
          id: user.id,
        },
      };
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002')
          throw new ForbiddenException('Invalid credentials');
      }
      throw error;
    }
  }

  async signin(body: AuthDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: body.email },
    });
    if (!user) {
      throw new NotFoundException('Invalid credentials');
    }

    const correctCredentials = await argon.verify(user.hash, body.password);

    if (!correctCredentials)
      throw new ForbiddenException('Invalid credentials');

    return {
      msg: 'User signed in successfully',
      user: {
        email: user.email,
        id: user.id,
      },
    };
  }
}
