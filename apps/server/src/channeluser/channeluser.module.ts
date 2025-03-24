import { Module } from '@nestjs/common';
import { ChannelUserService } from './channeluser.service';
import { ChanneluserController } from './channeluser.controller';

@Module({
  providers: [ChannelUserService],
  controllers: [ChanneluserController],
})
export class ChannelUserModule {}
