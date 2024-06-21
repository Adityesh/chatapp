import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { GoogleStrategy } from '../strategies/google.strategy';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthSerializer } from '../serializer/AuthSerializer';
import { User } from '../entities/user.entity';
import { LocalStrategy } from '../strategies/local.strategy';
import { EventsModule } from 'src/events/events.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]), EventsModule],
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
