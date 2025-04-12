import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Channel } from './channel.entity';
import { ChannelUser } from '../channeluser/channeluser.entity';
import { User } from '../user/user.entity';
import { BaseChannelDto, PaginatedSearchQuery } from 'shared';
import { CHANNEL_PAGINATION_CONFIG } from '../common/utils/pagination';
import { paginate } from 'nestjs-paginate';
import { InjectMapper } from '@automapper/nestjs';
import { Mapper } from '@automapper/core';

@Injectable()
export class ChannelService {
  constructor(
    @InjectRepository(Channel)
    private readonly channelRepository: Repository<Channel>,
    @InjectRepository(ChannelUser)
    private readonly channelUserRepository: Repository<ChannelUser>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectMapper()
    private readonly mapper: Mapper,
  ) {}

  async createDirectChannel(userIds: number[]) {
    const userEntities = await this.userRepository
      .createQueryBuilder('user')
      .where('user.id IN (:...userIds)', { userIds })
      .getMany();
    const channel = await this.channelRepository.save({});
    channel.users = await this.channelUserRepository.save(
      userEntities.map(
        (user) =>
          ({
            user,
            channel,
          }) as ChannelUser,
      ),
    );
    return await this.channelRepository.save(channel);
  }

  async getAllChannels(query: PaginatedSearchQuery, userId?: number) {
    let baseQuery = this.channelRepository
      .createQueryBuilder('channel')
      .innerJoin('channel.users', 'cu')
      .innerJoin('cu.user', 'user')
      .select([
        'channel.id',
        'channel.updatedAt',
        'channel.channelType',
        'channel.createdAt',
        'channel.createdBy',
        'channel.createdAt',
        'channel.channelAvatar',
        'channel.topic',
        'channel.description',
        'cu.id',
        'user.id',
        'user.userName',
        'user.fullName',
        'user.avatarUrl',
      ]);

    if (userId) {
      const userChannels = await this.channelUserRepository
        .createQueryBuilder('cs')
        .innerJoin('cs.channel', 'c')
        .innerJoin('cs.user', 'u')
        .select(['cs.id', 'c.id', 'u.id'])
        .where('u.id = :userId', { userId })
        .getMany();
      const channelIds = userChannels.map((c) => c.channel.id);

      baseQuery = baseQuery.where('channel.id IN (:...channelIds)', {
        channelIds,
      });
    }

    const result = await paginate(query, baseQuery, CHANNEL_PAGINATION_CONFIG);
    return {
      ...result,
      data: await this.mapper.mapArrayAsync(
        result.data,
        Channel,
        BaseChannelDto,
      ),
    };
  }

  async getChannel(id: number) {
    const channelEntity = await this.channelRepository
      .createQueryBuilder('channel')
      .innerJoin('channel.users', 'cu')
      .innerJoin('cu.user', 'user')
      .where('channel.id = :id', { id })
      .select([
        'channel.id',
        'channel.updatedAt',
        'channel.channelType',
        'channel.createdAt',
        'channel.createdBy',
        'channel.createdAt',
        'channel.channelAvatar',
        'channel.topic',
        'channel.description',
        'cu.id',
        'user.id',
        'user.userName',
        'user.fullName',
        'user.avatarUrl',
      ])
      .getOne();
    return await this.mapper.mapAsync(channelEntity, Channel, BaseChannelDto);
  }

}
