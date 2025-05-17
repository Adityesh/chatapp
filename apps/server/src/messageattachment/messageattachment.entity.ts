import { Column, Entity, ManyToOne } from 'typeorm';
import { BaseEntity } from '../common/entities/base.entity';
import { Message } from '../message/message.entity';
import { AutoMap } from '@automapper/classes';

@Entity({ name: 'message_attachments' })
export class MessageAttachment extends BaseEntity {
  @AutoMap()
  @Column({ name: 'mime_type' })
  mimeType: string;

  @AutoMap()
  @Column({ name: 'url' })
  url: string;

  @AutoMap()
  @Column({ name: 'size' })
  size: number;

  @AutoMap(() => Message)
  @ManyToOne(() => Message, (message) => message.attachments, {
    onDelete: 'CASCADE',
  })
  message: Message;

  @Column({ name: 'vendor_id', nullable: true })
  vendorId?: string;

}
