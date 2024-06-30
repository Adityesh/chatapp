import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  GetChatDetailsDto,
  InitateChatDto,
  SendMessageDto,
} from 'src/dto/chat.dto';
import { Channel } from 'src/entities/channel.entity';
import { ChannelUser } from 'src/entities/channeluser.entity';
import { Message } from 'src/entities/message.entity';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import { paginate, IPaginationOptions } from 'nestjs-typeorm-paginate';
import { SocketService } from 'src/socket/socket.service';

@Injectable()
export class ChatService {
  constructor(
    private readonly socketService: SocketService,
    @InjectRepository(Channel)
    private readonly channelRepository: Repository<Channel>,
    @InjectRepository(ChannelUser)
    private readonly channelUserRepository: Repository<ChannelUser>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
  ) {}

  async initateChat({ receiverId, senderId }: InitateChatDto) {
    // sender id is the user who will be initating the chat
    // check if there is a chat already present
    const chatExists = await this.channelRepository
      .createQueryBuilder('channel')
      .where('channel.isGroup = :isGroup', { isGroup: false })
      .innerJoinAndSelect('channel.users', 'channelmembers')
      .innerJoinAndSelect('channelmembers.userId', 'users')
      .where(
        'channelmembers.userId = :senderId OR channelmembers.userId = :receiverId',
        { senderId, receiverId },
      )
      .getOne();

    if (chatExists) {
      return {
        channelId: chatExists.id,
      };
    }

    // create a channel and then channel users
    const [sender, receiver] = await Promise.all([
      this.userRepository.findOneBy({
        id: senderId,
      }),
      this.userRepository.findOneBy({
        id: receiverId,
      }),
    ]);

    const senderChannelMember = new ChannelUser();
    senderChannelMember.userId = sender;

    const receiverChannelMember = new ChannelUser();
    receiverChannelMember.userId = receiver;

    const newChannel = this.channelRepository.create({
      isGroup: false,
      createdBy: sender,
      users: [senderChannelMember, receiverChannelMember],
    });

    await this.channelRepository.save(newChannel);

    return {
      channelId: newChannel.id,
    };
  }

  async getChatDetails({ channelId }: GetChatDetailsDto) {
    return await this.channelRepository
      .createQueryBuilder('channel')
      .select([
        'channel.id',
        'channel.topic',
        'channel.isGroup',
        'channel.description',
        'channel.createdAt',
        'channel.updatedAt',
        'channelusers',
      ])
      .innerJoin('channel.users', 'channelusers')
      .innerJoin('channelusers.userId', 'users')
      .innerJoin('channel.createdBy', 'usercreator')
      .addSelect([
        'users.id',
        'users.userName',
        'users.fullName',
        'users.avatarUrl',
        'usercreator.id',
        'usercreator.userName',
        'usercreator.fullName',
        'usercreator.avatarUrl',
      ])
      .where('channel.id = :channelId', { channelId })
      .getOne();
  }

  async sendMessage({ senderId, content }: SendMessageDto, channelId: number) {
    const newMessage = this.messageRepository.create({
      channelId: {
        id: channelId,
      },
      senderId: {
        id: senderId,
      },
      content,
    });
    return await this.messageRepository.save(newMessage);
  }

  async getMessages(channelId: number, options: IPaginationOptions) {
    const paginationQuery = this.messageRepository
      .createQueryBuilder('messages')
      .where('messages.channelId.id = :channelId', { channelId })
      .select([
        'messages.id',
        'messages.status',
        'messages.content',
        'messages.createdAt',
        'messages.updatedAt',
      ])
      .innerJoin('messages.channelId', 'channel')
      .innerJoin('messages.senderId', 'sender')
      .addSelect([
        'channel.id',
        'channel.topic',
        'channel.description',
        'sender.id',
        'sender.userName',
        'sender.fullName',
        'sender.avatarUrl',
      ]);
    return paginate<Message>(paginationQuery, options);
  }
}
