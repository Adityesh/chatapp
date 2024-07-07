import * as bcrypt from 'bcrypt';
import { BeforeInsert, Column, Entity, Index, OneToMany } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Channel } from './channel.entity';
import { ChannelUser } from './channeluser.entity';
import { Connection } from './connection.entity';
import { Message } from './message.entity';
import { MessageStatus } from './messagestatus.entity';

@Entity({ name: 'users' })
export class User extends BaseEntity {
  @Index()
  @Column({ name: 'full_name' })
  fullName: string;

  @Index()
  @Column({ name: 'user_name', unique: true })
  userName: string;

  @Column({ name: 'password', type: 'varchar', nullable: true })
  password: string;

  @Column({ default: false, name: 'is_deleted' })
  isDeleted: boolean;

  @Column({ name: 'google_id', nullable: true })
  googleId: string;

  @Column({ name: 'avatar_url', nullable: true, default: null })
  avatarUrl: string;

  @Index()
  @Column({ name: 'email', unique: true })
  email: string;

  @OneToMany(() => Connection, (connection) => connection.requestedBy)
  connectionsInitiated: Connection[];

  @OneToMany(() => Connection, (connection) => connection.addressedTo)
  connectionsReceived: Connection[];

  @OneToMany(() => Channel, (channel) => channel.createdBy)
  channelsCreated: Channel[];

  @OneToMany(() => Message, (message) => message.sender)
  sentMessages: Message[];

  @OneToMany(() => ChannelUser, (channelUser) => channelUser.user)
  channels: ChannelUser[];

  @OneToMany(() => MessageStatus, (messageStatus) => messageStatus.user)
  readMessages: MessageStatus[];

  @BeforeInsert()
  async hashPassword(): Promise<void> {
    if (!this.password) return;
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
  }
}
