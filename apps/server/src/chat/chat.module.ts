import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Channel } from 'src/entities/channel.entity';
import { ChannelUser } from 'src/entities/channeluser.entity';
import { User } from 'src/entities/user.entity';
import { Message } from 'src/entities/message.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Channel, ChannelUser, User, Message])],
  providers: [ChatService],
  controllers: [ChatController],
  exports: [ChatService],
})
export class ChatModule {}
