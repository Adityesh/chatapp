import { Module } from '@nestjs/common';
import { ChanneluserService } from './channeluser.service';
import { ChanneluserController } from './channeluser.controller';

@Module({
  providers: [ChanneluserService],
  controllers: [ChanneluserController],
})
export class ChanneluserModule {}
