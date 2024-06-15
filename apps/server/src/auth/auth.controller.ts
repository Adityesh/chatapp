import {
  Controller,
  Get,
  InternalServerErrorException,
  Request,
  Response,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { GoogleOAuthGuard } from '../guards/auth.guard';
import { ProtectedGuard } from 'src/guards/protected.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get()
  @UseGuards(GoogleOAuthGuard)
  async googleAuth() {}

  @Get('google-redirect')
  @UseGuards(GoogleOAuthGuard)
  googleAuthRedirect(@Request() req) {
    return req.user;
  }

  @Get('test-protected')
  @UseGuards(ProtectedGuard)
  protectedRoute(@Request() req) {
    return { isLoggedIn: req.session };
  }

  @Get('logout')
  logout(@Request() req, @Response() res) {
    req.logOut((err) => {
      if (err)
        throw new InternalServerErrorException(null, 'Internal Server Error');
      req.session.destroy();
      res.redirect('/');
    });
  }
}
