import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from '../common/entities/base.entity';
import { Channel } from '../channel/channel.entity';
import { MessageStatus } from '../messagestatus/messagestatus.entity';
import { User } from '../user/user.entity';
import { MessageAttachment } from '../messageattachment/messageattachment.entity';
import { AutoMap } from '@automapper/classes';

@Entity({ name: 'messages' })
export class Message extends BaseEntity {
  @AutoMap()
  @Column({ name: 'content' })
  content: string;

  @AutoMap(() => User)
  @ManyToOne(() => User, (user) => user.sentMessages)
  @JoinColumn({ name: 'sender_id' })
  sender: User;

  @AutoMap(() => Channel)
  @ManyToOne(() => Channel, (channel) => channel.channelMessages)
  @JoinColumn({ name: 'channel_id' })
  channel: Channel;

  @AutoMap()
  @Column({
    name: 'is_edited',
    type: 'boolean',
    default: false,
  })
  isEdited: boolean;

  @AutoMap(() => Message)
  @ManyToOne(() => Message, (message) => message, { nullable: true })
  @JoinColumn({ name: 'reply_to' })
  replyTo: Message;

  @AutoMap(() => [MessageStatus])
  @OneToMany(() => MessageStatus, (messageStatus) => messageStatus.message, {
    cascade: true,
  })
  messageStatus: MessageStatus[];

  @AutoMap(() => [MessageAttachment])
  @OneToMany(
    () => MessageAttachment,
    (messageAttachment) => messageAttachment.message,
    { cascade: ['insert'] },
  )
  attachments: MessageAttachment[];
}
