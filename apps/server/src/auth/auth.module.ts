import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { GoogleStrategy } from './strategies/google.strategy';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthSerializer } from './serializer/AuthSerializer';
import { User } from '../user/user.entity';
import { LocalStrategy } from './strategies/local.strategy';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';
import { ConfigurationModule } from '../configuration/configuration.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    CloudinaryModule,
    ConfigurationModule,
  ],
  providers: [
    AuthService,
    GoogleStrategy,
    ConfigService,
    AuthSerializer,
    LocalStrategy,
  ],
  controllers: [AuthController],
})
export class AuthModule {}
