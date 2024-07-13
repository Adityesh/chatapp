import { Column, Entity, ManyToOne } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Message } from './message.entity';

@Entity({ name: 'message_attachments' })
export class MessageAttachment extends BaseEntity {
  @Column({ name: 'mime_type' })
  mimeType: string;

  @Column({ name: 'url' })
  url: string;

  @Column({ name: 'size' })
  size: number;

  @ManyToOne(() => Message, (message) => message.attachments, {
    onDelete: 'CASCADE',
  })
  message: Message;
}
