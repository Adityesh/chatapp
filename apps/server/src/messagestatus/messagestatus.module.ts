import { Module } from '@nestjs/common';
import { MessagestatusController } from './messagestatus.controller';
import { MessagestatusService } from './messagestatus.service';

@Module({
  controllers: [MessagestatusController],
  providers: [MessagestatusService],
})
export class MessagestatusModule {}
