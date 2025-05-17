import { Module } from '@nestjs/common';
import { MessageController } from './message.controller';
import { MessageService } from './message.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Message } from './message.entity';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';
import { MessageAttachmentModule } from '../messageattachment/messageattachment.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Message]),
    CloudinaryModule,
    MessageAttachmentModule,
  ],
  controllers: [MessageController],
  providers: [MessageService],
  exports: [MessageService],
})
export class MessageModule {}
