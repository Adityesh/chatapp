import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../common/entities/base.entity';
import { Channel } from '../channel/channel.entity';
import { User } from '../user/user.entity';

@Entity({ name: 'channel_users' })
export class ChannelUser extends BaseEntity {
  @ManyToOne(() => User, (user) => user.channels, {
    cascade: true,
  })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Channel, (channel) => channel.users)
  @JoinColumn({ name: 'channel_id' })
  channel: Channel;

  @Column({ name: 'is_admin', type: 'boolean', default: false })
  isAdmin: boolean;
}
