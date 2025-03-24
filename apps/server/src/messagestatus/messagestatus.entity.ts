import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { BaseEntity } from '../common/entities/base.entity';
import { Message } from '../message/message.entity';
import { User } from '../user/user.entity';
import { IsEnum } from 'class-validator';
import { MessageStatusEnum } from 'shared';
import { AutoMap } from '@automapper/classes';

@Entity({ name: 'message_status' })
export class MessageStatus extends BaseEntity {
  @AutoMap(() => Message)
  @ManyToOne(() => Message, (message) => message.messageStatus)
  @JoinColumn({ name: 'message_id' })
  message: Message;

  @AutoMap(() => User)
  @ManyToOne(() => User, (user) => user.readMessages)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @AutoMap(() => String)
  @Column({
    name: 'status',
    type: 'enum',
    enum: MessageStatusEnum,
    default: MessageStatusEnum.SENT,
  })
  @IsEnum(MessageStatusEnum)
  status: MessageStatusEnum;

  @AutoMap(() => Date)
  @CreateDateColumn({ name: 'delivered_at', nullable: true })
  deliveredAt: Date;

  @AutoMap(() => Date)
  @CreateDateColumn({ name: 'read_at', nullable: true })
  readAt: Date;

  @AutoMap(() => Date)
  @Column({ type: 'varchar', length: 255, nullable: true })
  error: string;
}
