import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from '../common/entities/base.entity';
import { Channel } from '../channel/channel.entity';
import { MessageStatus } from '../messagestatus/messagestatus.entity';
import { User } from '../user/user.entity';
import { MessageAttachment } from '../messageattachment/messageattachment.entity';

@Entity({ name: 'messages' })
export class Message extends BaseEntity {
  @Column({ name: 'content' })
  content: string;

  @ManyToOne(() => User, (user) => user.sentMessages)
  @JoinColumn({ name: 'sender_id' })
  sender: User;

  @ManyToOne(() => Channel, (channel) => channel.channelMessages)
  @JoinColumn({ name: 'channel_id' })
  channel: Channel;

  @Column({
    name: 'is_edited',
    type: 'boolean',
    default: false,
  })
  isEdited: boolean;

  @ManyToOne(() => Message, (message) => message, { nullable: true })
  @JoinColumn({ name: 'reply_to' })
  replyTo: Message;

  @OneToMany(() => MessageStatus, (messageStatus) => messageStatus.message, {
    cascade: true,
  })
  messageStatus: MessageStatus[];

  @OneToMany(
    () => MessageAttachment,
    (messageAttachment) => messageAttachment.message,
    { cascade: ['insert'] },
  )
  attachments: MessageAttachment[];
}
