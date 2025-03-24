import { Module } from '@nestjs/common';
import { ChannelController } from './channel.controller';
import { ChannelService } from './channel.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Channel } from './channel.entity';
import { ChannelUser } from '../channeluser/channeluser.entity';
import { User } from '../user/user.entity';

@Module({
  controllers: [ChannelController],
  providers: [ChannelService],
  exports: [ChannelService],
  imports: [TypeOrmModule.forFeature([Channel, ChannelUser, User])],
})
export class ChannelModule {}
