import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { BaseEntity } from '../common/entities/base.entity';
import { ChannelUser } from '../channeluser/channeluser.entity';
import { Message } from '../message/message.entity';
import { User } from '../user/user.entity';
import { ChannelTypeEnum } from 'shared';
import { AutoMap } from '@automapper/classes';

@Entity({ name: 'channels' })
export class Channel extends BaseEntity {
  @AutoMap()
  @Index()
  @Column({ name: 'topic', unique: true, nullable: true })
  topic: string;

  @AutoMap()
  @Column({ name: 'description', nullable: true })
  description: string;

  @AutoMap(() => String)
  @Column({
    type: 'enum',
    enum: ChannelTypeEnum,
    default: ChannelTypeEnum.DIRECT,
    name: 'channel_type',
  })
  channelType: ChannelTypeEnum;

  @AutoMap()
  @Column({ name: 'channel_avatar', nullable: true })
  channelAvatar: string;

  @AutoMap(() => [Message])
  @OneToMany(() => Message, (message) => message.channel)
  channelMessages: Message[];

  @AutoMap(() => User)
  @ManyToOne(() => User, (user) => user.channelsCreated)
  @JoinColumn({ name: 'created_by' })
  createdBy: User;

  @AutoMap(() => [ChannelUser])
  @OneToMany(() => ChannelUser, (channelUser) => channelUser.channel, {
    cascade: true,
  })
  users: ChannelUser[];
}
