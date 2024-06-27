import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from 'src/entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventsModule } from 'src/events/events.module';
import { UserController } from './user.controller';

@Module({
  imports: [EventsModule, TypeOrmModule.forFeature([User])],
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
