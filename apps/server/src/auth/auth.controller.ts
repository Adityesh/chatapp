import {
  Body,
  Controller,
  Get,
  InternalServerErrorException,
  Post,
  Request,
  Response,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { GoogleOAuthGuard } from '../guards/auth.guard';
import { ProtectedGuard } from 'src/guards/protected.guard';
import { LocalAuthGuard } from 'src/guards/local-auth.guard';
import { RegisterLocalUserDto } from 'src/dto/local-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('google')
  @UseGuards(GoogleOAuthGuard)
  async googleAuth() {}

  @Get('google-redirect')
  @UseGuards(GoogleOAuthGuard)
  googleAuthRedirect(@Request() req) {
    return req.user;
  }

  @Post('local/register')
  registerLocal(@Body() registerLocalUserDto: RegisterLocalUserDto) {
    return this.authService.registerLocalUser(registerLocalUserDto);
  }

  @UseGuards(LocalAuthGuard)
  @Post('local/login')
  loginLocal() {
    return true;
  }

  @Get('test-protected')
  @UseGuards(ProtectedGuard)
  protectedRoute(@Request() req) {
    return { isLoggedIn: req.session };
  }

  @UseGuards(LocalAuthGuard)
  @Post('auth/login')
  async login(@Request() req) {
    return req.user;
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
