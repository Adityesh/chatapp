import * as bcrypt from 'bcrypt';
import { BeforeInsert, Column, Entity, Index, OneToMany } from 'typeorm';
import { BaseEntity } from '../common/entities/base.entity';
import { Channel } from '../channel/channel.entity';
import { ChannelUser } from '../channeluser/channeluser.entity';
import { Connection } from '../connection/connection.entity';
import { Message } from '../message/message.entity';
import { MessageStatus } from '../messagestatus/messagestatus.entity';
import { AutoMap } from '@automapper/classes';

@Entity({ name: 'users' })
export class User extends BaseEntity {
  @AutoMap()
  @Index()
  @Column({ name: 'full_name' })
  fullName: string;

  @AutoMap()
  @Index()
  @Column({ name: 'user_name', unique: true })
  userName: string;

  @Column({ name: 'password', type: 'varchar', nullable: true })
  password: string;

  @Column({ name: 'google_id', nullable: true })
  googleId: string;

  @AutoMap({ type: () => String })
  @Column({ name: 'avatar_url', nullable: true, default: null })
  avatarUrl: string;

  @AutoMap()
  @Index()
  @Column({ name: 'email', unique: true })
  email: string;

  @AutoMap()
  @OneToMany(() => Connection, (connection) => connection.requester)
  connectionsRequested: Connection[];

  @AutoMap()
  @OneToMany(() => Connection, (connection) => connection.recipient)
  connectionsReceived: Connection[];

  @AutoMap()
  @OneToMany(() => Channel, (channel) => channel.createdBy)
  channelsCreated: Channel[];

  @AutoMap()
  @OneToMany(() => Message, (message) => message.sender)
  sentMessages: Message[];

  @AutoMap()
  @OneToMany(() => ChannelUser, (channelUser) => channelUser.user)
  channels: ChannelUser[];

  @AutoMap()
  @OneToMany(() => MessageStatus, (messageStatus) => messageStatus.user)
  readMessages: MessageStatus[];

  @BeforeInsert()
  async hashPassword(): Promise<void> {
    if (!this.password) return;
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
  }
}
