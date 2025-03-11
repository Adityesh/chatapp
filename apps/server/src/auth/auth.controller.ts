import {
  Body,
  Controller,
  FileTypeValidator,
  Get,
  MaxFileSizeValidator,
  ParseFilePipe,
  Post,
  Redirect,
  Req,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { GoogleOAuthGuard } from './guards/auth.guard';
import { ProtectedGuard } from 'src/auth/guards/protected.guard';
import { LocalAuthGuard } from 'src/auth/guards/local-auth.guard';
import { Request, Response } from 'express';
import 'dotenv/config';
import { FileInterceptor } from '@nestjs/platform-express';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { ConfigurationService } from '../configuration/configuration.service';
import { RegisterLocalUserDto } from './dtos/register-local-user.dto';

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
  @Redirect()
  googleAuthRedirect(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    res.cookie('valid_session', req.user !== undefined, {
      httpOnly: false,
      maxAge: this.configService.get('COOKIE_MAXAGE'),
    });
    res.redirect(this.configService.get('CLIENT_ORIGIN') + '/');
  }

  @Post('local/register')
  @UseInterceptors(FileInterceptor('avatarUrl'))
  registerLocal(
    @Body() registerLocalUserDto: RegisterLocalUserDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 1024 * 1024 }),
          new FileTypeValidator({ fileType: '.(png|jpeg|jpg)' }),
        ],
      }),
    )
    avatarUrl: Express.Multer.File,
  ) {
    return this.authService.registerLocalUser(registerLocalUserDto, avatarUrl);
  }

  @UseGuards(LocalAuthGuard)
  @Post('local/login')
  loginLocal(@Req() req: Request, @Res({ passthrough: true }) res: any) {
    res
      .cookie('valid_session', req.user !== undefined, {
        httpOnly: false,
        maxAge: this.configService.get('COOKIE_MAXAGE'),
      })
      .json({ user: req.user });
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

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    return this.cloudinaryService.uploadFile(file);
  }
}
