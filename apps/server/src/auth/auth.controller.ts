import {
  Body,
  Controller,
  Get,
  Post,
  Redirect,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { GoogleOAuthGuard } from '../guards/auth.guard';
import { ProtectedGuard } from 'src/guards/protected.guard';
import { LocalAuthGuard } from 'src/guards/local-auth.guard';
import { RegisterLocalUserDto } from 'src/dto/local-user.dto';
import { Request, Response } from 'express';
import 'dotenv/config';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('google')
  @UseGuards(GoogleOAuthGuard)
  async googleAuth() {}

  @Get('google-redirect')
  @UseGuards(GoogleOAuthGuard)
  @Redirect()
  googleAuthRedirect(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    res.cookie('valid_session', req.user !== undefined, {
      httpOnly: false,
      maxAge: Number(process.env.COOKIE_MAXAGE),
    });
    res.redirect(process.env.CLIENT_ORIGIN + '/');
  }

  @Post('local/register')
  registerLocal(@Body() registerLocalUserDto: RegisterLocalUserDto) {
    return this.authService.registerLocalUser(registerLocalUserDto);
  }

  @UseGuards(LocalAuthGuard)
  @Post('local/login')
  loginLocal(@Req() req: Request, @Res({ passthrough: true }) res: any) {
    res.cookie('valid_session', req.user !== undefined, {
      httpOnly: false,
      maxAge: Number(process.env.COOKIE_MAXAGE),
    });
    res.json({ user: req.user });
  }

  @Get('test-protected')
  @UseGuards(ProtectedGuard)
  protectedRoute(@Req() req) {
    return { isLoggedIn: req.session };
  }

  @Post('logout')
  logout(@Req() req: any, @Res({ passthrough: true }) res: Response) {
    req.session.destroy();
    res
      .clearCookie('valid_session')
      .clearCookie('connect.sid')
      .json({ success: true });
  }
}
