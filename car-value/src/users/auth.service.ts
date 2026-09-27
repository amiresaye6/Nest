import { BadRequestException, Injectable } from '@nestjs/common';
import { UsersService } from './users.service';
import { promisify } from 'util';
import { scrypt as _scrypt, randomBytes } from 'crypto';

const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async signup(email: string, password: string) {
    // see if email is in use?
    // hash user password
    // create new user
    // save it to db
    // return the created user.

    const users = await this.usersService.find(email);

    if (users.length) {
      throw new BadRequestException(
        'Invalid email or password, please try again!',
      );
    }

    const salt = randomBytes(8).toString('hex');

    const hashedPassword = (await scrypt(password, salt, 32)) as Buffer;
    const result = `${salt}.${hashedPassword.toString('hex')}`;

    const user = this.usersService.create(email, result);
    return user;
  }

  async signin(email: string, password: string) {
    const [user] = await this.usersService.find(email);

    if (!user) {
      throw new BadRequestException(
        'Invalid email or password, please try again!',
      );
    }
    const [salt, hash] = user.password.split('.');

    const hashedPassword = (await scrypt(password, salt, 32)) as Buffer;

    if (hashedPassword.toString('hex') !== hash) {
      throw new BadRequestException(
        'Invalid email or password, please try again later.',
      );
    }
    return user;
  }
}
