import {
  Body,
  Controller,
  Get,
  InternalServerErrorException,
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
import { EventsGateway } from 'src/events/events.gateway';
import { Request, Response } from 'express';
import 'dotenv/config';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly eventsGateway: EventsGateway,
  ) {}

  @Get('google')
  @UseGuards(GoogleOAuthGuard)
  async googleAuth() {}

  @Get('google-redirect')
  @UseGuards(GoogleOAuthGuard)
  @Redirect()
  googleAuthRedirect(@Req() req: Request, @Res() res: Response) {
    res.cookie('valid_session', req.user !== undefined, {
      httpOnly: false,
      maxAge: Number(process.env.COOKIE_MAXAGE),
    });
    return {
      url: process.env.CLIENT_ORIGIN,
    };
  }

  @Post('local/register')
  registerLocal(@Body() registerLocalUserDto: RegisterLocalUserDto) {
    return this.authService.registerLocalUser(registerLocalUserDto);
  }

  @UseGuards(LocalAuthGuard)
  @Post('local/login')
  loginLocal(@Req() req: Request, res: Response) {
    res.cookie('valid_session', req.user !== undefined, {
      httpOnly: false,
      maxAge: Number(process.env.COOKIE_MAXAGE),
    });
    return true;
  }

  @Get('test-protected')
  @UseGuards(ProtectedGuard)
  protectedRoute(@Req() req) {
    return { isLoggedIn: req.session };
  }

  @UseGuards(LocalAuthGuard)
  @Post('auth/login')
  async login(@Req() req) {
    return req.user;
  }

  @Post('logout')
  logout(@Req() req: Request, @Res() res: Response) {
    req.logOut((err) => {
      if (err)
        throw new InternalServerErrorException(null, 'Internal Server Error');
      req.session.destroy(() => {
        res.clearCookie('valid_session');
        res.clearCookie('connect.sid');
        res.redirect('/');
      });
    });
  }

  @Post('message')
  sendMessage(@Req() request) {
    console.log(request.body);
    this.eventsGateway.server.emit('message', request.body);
    return {
      msg: request.body,
    };
  }
}
