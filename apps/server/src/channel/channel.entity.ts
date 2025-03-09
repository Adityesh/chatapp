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
import { ChannelTypeEnum } from './enums/channel-type.enum';

@Entity({ name: 'channels' })
export class Channel extends BaseEntity {
  @Index()
  @Column({ name: 'topic', unique: true, nullable: true })
  topic: string;

  @Column({ name: 'description', nullable: true })
  description: string;

  @Column({
    type: 'enum',
    enum: ChannelTypeEnum,
    default: ChannelTypeEnum.DIRECT,
    name: 'channel_type',
  })
  channelType: ChannelTypeEnum;

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
