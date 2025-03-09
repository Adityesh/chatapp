import { PassportSerializer } from '@nestjs/passport';
import { AuthService } from '../auth.service';
import { Injectable } from '@nestjs/common';
import { VerifyCallback } from 'passport-google-oauth20';
import { User } from 'src/user/user.entity';

@Injectable()
export class AuthSerializer extends PassportSerializer {
  constructor(private readonly authService: AuthService) {
    super();
  }

  serializeUser(user: User, done: VerifyCallback) {
    done(null, user);
  }
  async deserializeUser(payload: any, done: VerifyCallback) {
    const user = await this.authService.findUserById(payload.id);
    return user ? done(null, user) : done(null, null);
  }
}
