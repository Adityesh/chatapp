import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MessageAttachment } from './messageattachment.entity';
import { Repository } from 'typeorm';
import { InsertMessageAttachmentDto } from 'shared';
import { CloudinaryService } from '../cloudinary/cloudinary.service';

@Injectable()
export class MessageAttachmentService {
  constructor(
    @InjectRepository(MessageAttachment)
    private readonly messageAttachmentRepository: Repository<MessageAttachment>,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async insertAttachments(attachments: InsertMessageAttachmentDto[]) {
    const insertResult = await this.messageAttachmentRepository
      .createQueryBuilder()
      .insert()
      .into(MessageAttachment)
      .values(
        attachments.map((a) => ({
          ...a,
          message: {
            id: a.messageId,
          },
        })),
      )
      .execute();
    return !!insertResult;
  }

  async deleteAttachmentByMessageId(messageId: number) {
    const messageAttachments = await this.messageAttachmentRepository
      .createQueryBuilder('ma')
      .where('ma.message.id = :messageId', { messageId: messageId })
      .select(['ma.vendorId'])
      .getMany();
    const publicIds = messageAttachments.map((a) => a.vendorId).filter(Boolean);

    await this.cloudinaryService.deleteFiles(publicIds);

    const deleteResult = await this.messageAttachmentRepository
      .createQueryBuilder()
      .delete()
      .from(MessageAttachment)
      .where('message.id = :messageId', { messageId: messageId })
      .execute();

    return deleteResult.affected > 0;
  }
}
