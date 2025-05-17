import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Message } from './message.entity';
import { Repository } from 'typeorm';
import {
  BaseMessageDto,
  CreateMessageDto,
  DeleteMessageDto,
  EditMessageDto,
  InsertMessageAttachmentDto,
  PaginatedSearchQuery,
} from 'shared';
import { paginate } from 'nestjs-paginate';
import { MESSAGE_PAGINATION_CONFIG } from '../common/utils/pagination';
import { InjectMapper } from '@automapper/nestjs';
import { Mapper } from '@automapper/core';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { MessageAttachmentService } from '../messageattachment/messageattachment.service';

@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
    @InjectMapper()
    private readonly mapper: Mapper,
    private readonly cloudinaryService: CloudinaryService,
    private readonly messageAttachmentService: MessageAttachmentService,
  ) {}

  async createMessage(
    { channelId, content, replyTo }: CreateMessageDto,
    currentUserId: number,
    files?: Array<Express.Multer.File>,
  ): Promise<BaseMessageDto> {
    const messageQuery = await this.messageRepository
      .createQueryBuilder('message')
      .insert()
      .into(Message)
      .values({
        replyTo: {
          id: replyTo,
        },
        sender: {
          id: currentUserId,
        },
        channel: {
          id: channelId,
        },
        content,
      })
      .returning(['id'])
      .execute();
    const messageId: number = messageQuery.raw[0].id;

    if (files) {
      await this.uploadAndInsertAttachments(files, messageId);
    }

    const savedMessage = await this.getMessageById(messageId);
    return await this.mapper.mapAsync(savedMessage, Message, BaseMessageDto);
  }

  async editMessage(
    { messageId, content }: EditMessageDto,
    currentUserId: number,
    files?: Array<Express.Multer.File>,
  ): Promise<BaseMessageDto> {
    const messageQuery = this.messageRepository
      .createQueryBuilder('message')
      .where('message.id = :messageId AND sender.id = :currentUserId', {
        messageId,
        currentUserId,
      })
      .innerJoin('message.sender', 'sender');

    if (!(await messageQuery.getExists())) {
      throw new UnauthorizedException(
        "You don't have permission to edit this message",
      );
    }

    const message = await messageQuery.getOne();
    message.content = content;
    message.isEdited = true;

    if (files) {
      await this.uploadAndInsertAttachments(files, messageId);
    }
    const savedMessage = await this.messageRepository.save(message);
    const messageResult = await this.getMessageById(savedMessage.id);
    return await this.mapper.mapAsync(messageResult, Message, BaseMessageDto);
  }

  async getMessages(query: PaginatedSearchQuery, channelId: number) {
    const baseQuery = this.messageRepository
      .createQueryBuilder('message')
      .where('channel.id = :channelId', { channelId })
      .innerJoin('message.channel', 'channel')
      .innerJoinAndSelect('message.sender', 'sender')
      .leftJoinAndSelect('message.replyTo', 'replyTo')
      .leftJoinAndSelect('replyTo.sender', 'replySender')
      .leftJoinAndSelect('message.attachments', 'attachments')
      .leftJoinAndSelect('message.messageStatus', 'messageStatus');

    const result = await paginate(query, baseQuery, MESSAGE_PAGINATION_CONFIG);
    return {
      ...result,
      data: await this.mapper.mapArrayAsync(
        result.data,
        Message,
        BaseMessageDto,
      ),
    };
  }

  async deleteMessage(
    { messageId, channelId }: DeleteMessageDto,
    currentUserId: number,
  ) {
    const elementExists = this.messageRepository
      .createQueryBuilder('message')
      .where(
        'message.id = :messageId AND message.channel.id = :channelId AND message.sender.id = :currentUserId',
        {
          messageId,
          channelId,
          currentUserId,
        },
      )
      .innerJoin('message.sender', 'sender')
      .innerJoin('message.channel', 'channel')
      .getExists();

    if (!elementExists) {
      throw new UnauthorizedException(
        "You don't have permission to delete this message",
      );
    }
    await this.messageAttachmentService.deleteAttachmentByMessageId(messageId);
    const { affected } = await this.messageRepository.delete(messageId);
    return affected === 1;
  }

  async getMessageById(messageId: number) {
    return await this.messageRepository
      .createQueryBuilder('message')
      .where('message.id = :id', { id: messageId })
      .innerJoin('message.channel', 'channel')
      .innerJoinAndSelect('message.sender', 'sender')
      .leftJoinAndSelect('message.replyTo', 'replyTo')
      .leftJoinAndSelect('message.attachments', 'attachments')
      .leftJoinAndSelect('message.messageStatus', 'messageStatus')
      .addSelect(['channel.id'])
      .getOne();
  }

  async uploadAndInsertAttachments(
    files: Array<Express.Multer.File>,
    messageId: number,
  ) {
    const fileUrls = await this.cloudinaryService.uploadMultipeFiles(files);
    if (fileUrls.length > 0) {
      const insertAttachmentDtos: InsertMessageAttachmentDto[] = fileUrls.map(
        (file, index) => ({
          messageId,
          url: file.url,
          size: file.bytes,
          mimeType: files[index].mimetype,
          vendorId: file.public_id,
        }),
      );
      return await this.messageAttachmentService.insertAttachments(
        insertAttachmentDtos,
      );
    }
    return false;
  }
}
