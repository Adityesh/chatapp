import { Module } from '@nestjs/common';
import { MessageAttachmentController } from './messageattachment.controller';
import { MessageAttachmentService } from './messageattachment.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MessageAttachment } from './messageattachment.entity';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';

@Module({
  controllers: [MessageAttachmentController],
  providers: [MessageAttachmentService],
  imports: [TypeOrmModule.forFeature([MessageAttachment]), CloudinaryModule],
  exports: [MessageAttachmentService],
})
export class MessageAttachmentModule {}
