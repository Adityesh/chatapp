import { CreateDateColumn, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Message } from './message.entity';
import { User } from './user.entity';

@Entity({ name: 'message_status' })
export class MessageStatus extends BaseEntity {
  @ManyToOne(() => Message, (message) => message.readMessages)
  @JoinColumn({ name: 'message_id' })
  message: Message;

  @ManyToOne(() => User, (user) => user.readMessages)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @CreateDateColumn({ name: 'delivered_at' })
  deliveredAt: Date;

  @CreateDateColumn({ name: 'read_at', nullable: true })
  readAt: Date;
}
