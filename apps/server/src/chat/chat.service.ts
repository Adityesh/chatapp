import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Channel } from 'src/entities/channel.entity';
import { ChannelUser } from 'src/entities/channeluser.entity';
import { Message } from 'src/entities/message.entity';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import { paginate, IPaginationOptions } from 'nestjs-typeorm-paginate';
import { SocketService } from 'src/socket/socket.service';
import {
  GetChatDetailsDto,
  InitateChatDto,
  SendMessageDto,
  SocketEvents,
} from '@repo/shared';
import dataSource from 'src/database/data-source';

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
      .innerJoinAndSelect('channelmembers.user', 'users')
      .where(
        'channelmembers.user = :senderId OR channelmembers.user = :receiverId',
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
    senderChannelMember.user = sender;

    const receiverChannelMember = new ChannelUser();
    receiverChannelMember.user = receiver;

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
      .innerJoin('channelusers.user', 'users')
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
      channel: {
        id: channelId,
      },
      sender: {
        id: senderId,
      },
      content,
    });
    await this.messageRepository.save(newMessage);
    const savedMessage = this.messageRepository
      .createQueryBuilder('messages')
      .where('messages.id = :messageId', { messageId: newMessage.id })
      .select([
        'messages.id',
        'messages.status',
        'messages.content',
        'messages.createdAt',
        'messages.updatedAt',
      ])
      .innerJoin('messages.channel', 'channel')
      .innerJoin('messages.sender', 'sender')
      .addSelect([
        'sender.id',
        'sender.userName',
        'sender.fullName',
        'sender.avatarUrl',
      ])
      .getOne();
    return savedMessage;
  }

  async getMessages(channelId: number, options: IPaginationOptions) {
    const paginationQuery = this.messageRepository
      .createQueryBuilder('messages')
      .orderBy('messages.createdAt', 'DESC')
      .where('messages.channel.id = :channelId', { channelId })
      .select([
        'messages.id',
        'messages.status',
        'messages.content',
        'messages.createdAt',
        'messages.updatedAt',
      ])
      .innerJoin('messages.channel', 'channel')
      .innerJoin('messages.sender', 'sender')
      .addSelect([
        'sender.id',
        'sender.userName',
        'sender.fullName',
        'sender.avatarUrl',
      ]);
    const result = paginate<Message>(paginationQuery, options);
    (await result).items.reverse();
    return result;
  }

  async getChannels(loggedInUserId: number, options: IPaginationOptions) {
    // Subquery to fetch channel IDs for the logged-in user
    const subQuery = this.channelRepository
      .createQueryBuilder('channel')
      .select('channel.id')
      .innerJoin('channel.users', 'channelUser')
      .where('channelUser.user = :loggedInUserId', { loggedInUserId })
      .getQuery();

    // Main query to fetch all channels for the logged-in user along with the other users in those channels
    const channels = this.channelRepository
      .createQueryBuilder('channel')
      .innerJoinAndSelect('channel.users', 'channelUser')
      .innerJoinAndSelect('channelUser.user', 'user')
      .where(`channel.id IN (${subQuery})`)
      .setParameter('loggedInUserId', loggedInUserId)
      .select([
        'channel.id',
        'channel.topic',
        'channel.description',
        'channel.isDeleted',
        'channel.isGroup',
        'channelUser.id',
        'user.id',
        'user.fullName',
        'user.userName',
        'user.avatarUrl'
      ]);

    const paginatedResult = await paginate<Channel>(channels, options);

    paginatedResult.items.forEach((ch) => {
      if (ch.isGroup) {
        ch.users = [];
      }
      ch.users = ch.users.filter((cu) => cu.user.id !== loggedInUserId);
    }, paginatedResult.items);

    return paginatedResult;
  }
}
