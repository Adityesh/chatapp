import { MessageStatusEnum } from 'src/enums/message.enum';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Channel } from './channel.entity';
import { MessageStatus } from './messagestatus.entity';
import { User } from './user.entity';

@Entity({ name: 'messages' })
export class Message extends BaseEntity {
  @Column({ name: 'content' })
  content: string;

  @ManyToOne(() => User, (user) => user.sentMessages)
  @JoinColumn({ name: 'sender_id' })
  senderId: User;

  @ManyToOne(() => Channel, (channel) => channel.channelMessages)
  @JoinColumn({ name: 'channel_id' })
  channelId: Channel;

  @Column({ name: 'is_deleted', type: 'boolean', default: false })
  isDeleted: boolean;

  @Column({
    name: 'status',
    type: 'enum',
    enum: MessageStatusEnum,
    default: MessageStatusEnum.SENT,
  })
  status: MessageStatusEnum;

  @OneToMany(() => MessageStatus, (messageStatus) => messageStatus.messageId)
  readMessages: MessageStatus[];
}
