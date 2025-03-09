import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { BaseEntity } from './base.entity';
import { ChannelUser } from './channeluser.entity';
import { Message } from './message.entity';
import { User } from './user.entity';

@Entity({ name: 'channels' })
export class Channel extends BaseEntity {
  @Index()
  @Column({ name: 'topic', unique: true, nullable: true })
  topic: string;

  @Column({ name: 'description', nullable: true })
  description: string;

  @Column({ name: 'is_deleted', type: 'boolean', default: false })
  isDeleted: boolean;

  @Column({ name: 'is_group', type: 'boolean', default: false })
  isGroup: boolean;

  @Column({ name: 'channel_avatar', nullable: true })
  channelAvatar: string;

  @OneToMany(() => Message, (message) => message.channel)
  channelMessages: Message[];

  @ManyToOne(() => User, (user) => user.channelsCreated)
  @JoinColumn({ name: 'created_by' })
  createdBy: User;

  @OneToMany(() => ChannelUser, (channelUser) => channelUser.channel, {
    cascade: true,
  })
  users: ChannelUser[];
}
