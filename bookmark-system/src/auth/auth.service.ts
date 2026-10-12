import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
  signup() {
    return { msg: ' i signed up successfully' };
  }

  signin() {
    return { msg: ' i signed up successfully' };
  }
}
