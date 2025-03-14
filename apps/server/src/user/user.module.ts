import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from 'src/user/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './user.controller';
import { Connection } from 'src/connection/connection.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Connection])],
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
