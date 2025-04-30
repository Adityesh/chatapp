import {
  Body,
  Controller,
  FileTypeValidator,
  Get,
  MaxFileSizeValidator,
  ParseFilePipe,
  Post,
  Req,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { GoogleOAuthGuard } from './guards/auth.guard';
import { LocalAuthGuard } from 'src/auth/guards/local-auth.guard';
import { Request, Response } from 'express';
import 'dotenv/config';
import { FileInterceptor } from '@nestjs/platform-express';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { ConfigurationService } from '../configuration/configuration.service';
import { RegisterUserDto } from 'shared';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly cloudinaryService: CloudinaryService,
    private readonly configService: ConfigurationService,
  ) {}

  @Get('google')
  @UseGuards(GoogleOAuthGuard)
  async googleAuth() {}

  @Get('google-redirect')
  @UseGuards(GoogleOAuthGuard)
  googleAuthRedirect(@Req() req: Request, @Res() res: Response) {
    res.cookie('valid_session', req.user !== undefined, {
      httpOnly: false,
      maxAge: this.configService.get('COOKIE_MAXAGE'),
    });
    return res.redirect(302, this.configService.get('CLIENT_ORIGIN') + '/');
  }

  @Post('register')
  @UseInterceptors(FileInterceptor('avatar'))
  registerLocal(
    @Body() registerLocalUserDto: RegisterUserDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 1024 * 1024 }),
          new FileTypeValidator({ fileType: '.(png|jpeg|jpg|gif)' }),
        ],
        fileIsRequired: false,
      }),
    )
    avatar?: Express.Multer.File,
  ) {
    return this.authService.registerUser(registerLocalUserDto, avatar);
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  loginLocal(@Req() req: Request, @Res() res: Response) {
    res
      .cookie('valid_session', req.user !== undefined, {
        httpOnly: false,
        maxAge: this.configService.get('COOKIE_MAXAGE'),
      })
      .end();
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
