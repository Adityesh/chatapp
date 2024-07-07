import { Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Channel } from './channel.entity';
import { User } from './user.entity';

@Entity({ name: 'channel_users' })
export class ChannelUser extends BaseEntity {
  @ManyToOne(() => User, (user) => user.channels)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Channel, (channel) => channel.users)
  @JoinColumn({ name: 'channel_id' })
  channel: Channel;
}
