import { Module } from '@nestjs/common';
import { MessageattachmentController } from './messageattachment.controller';
import { MessageattachmentService } from './messageattachment.service';

@Module({
  controllers: [MessageattachmentController],
  providers: [MessageattachmentService],
})
export class MessageattachmentModule {}
