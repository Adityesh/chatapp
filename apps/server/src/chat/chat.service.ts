import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  GetChatDetailsDto,
  InitateChatDto,
  SendMessageDto,
} from '@repo/shared';
import { IPaginationOptions, paginate } from 'nestjs-typeorm-paginate';
import { Channel } from 'src/entities/channel.entity';
import { ChannelUser } from 'src/entities/channeluser.entity';
import { Message } from 'src/entities/message.entity';
import { MessageStatus } from 'src/entities/messagestatus.entity';
import { User } from 'src/entities/user.entity';
import { SocketService } from 'src/socket/socket.service';
import { Repository } from 'typeorm';

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
    @InjectRepository(MessageStatus)
    private readonly messageStatusRepository: Repository<MessageStatus>,
  ) {}

  async initateChat({ receiverId, senderId }: InitateChatDto) {
    // sender id is the user who will be initating the chat
    // check if there is a chat already present
    const chatExists = await this.channelRepository
      .createQueryBuilder('channel')
      .where('channel.isGroup = :isGroup', { isGroup: false })
      .innerJoinAndSelect(
        'channel.users',
        'channelmembers1',
        'channelmembers1.user.id = :senderId',
        { senderId },
      )
      .innerJoinAndSelect(
        'channel.users',
        'channelmembers2',
        'channelmembers2.user.id = :receiverId',
        { receiverId },
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
    const channelUsers = await this.channelUserRepository
      .createQueryBuilder('cu')
      .where('cu.channel.id = :channelId', {
        channelId,
      })
      .innerJoinAndSelect('cu.user', 'user')
      .innerJoinAndSelect('cu.channel', 'channel')
      .getMany();

    const messageStatus = channelUsers.map((cu) => ({
      user: {
        id: cu.user.id,
      },
      deliveredAt: new Date(),
      readAt: cu.user.id === senderId ? new Date() : null,
    }));

    const newMessage = this.messageRepository.create({
      channel: {
        id: channelId,
      },
      sender: {
        id: senderId,
      },
      content,
      messageStatus: [...messageStatus],
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
      .innerJoin('messages.sender', 'sender')
      .innerJoin('messages.messageStatus', 'messageStatus')
      .innerJoin('messageStatus.user', 'statususer')
      .addSelect([
        'sender.id',
        'sender.userName',
        'sender.fullName',
        'sender.avatarUrl',
        'messageStatus.readAt',
        'messageStatus.id',
        'messageStatus.deliveredAt',
        'statususer.id',
        'statususer.fullName',
        'statususer.userName',
        'statususer.avatarUrl',
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
      .innerJoin('messages.messageStatus', 'messageStatus')
      .innerJoin('messageStatus.user', 'statususer')
      .addSelect([
        'sender.id',
        'sender.userName',
        'sender.fullName',
        'sender.avatarUrl',
        'messageStatus.readAt',
        'messageStatus.id',
        'messageStatus.deliveredAt',
        'statususer.id',
        'statususer.fullName',
        'statususer.userName',
        'statususer.avatarUrl',
      ]);
    const result = await paginate<Message>(paginationQuery, options);
    result.items.reverse();
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
        'user.avatarUrl',
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

  async markMessageAsRead(messageStatusId: number) {
    const result = await this.messageStatusRepository.save({
      id: messageStatusId,
      readAt: new Date(),
    });
    return result;
  }
}
