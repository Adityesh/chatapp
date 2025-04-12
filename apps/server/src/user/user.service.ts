import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/user.entity';
import { Repository } from 'typeorm';
import { paginate } from 'nestjs-paginate';
import { USER_PAGINATION_CONFIG } from '../common/utils/pagination';
import { InjectMapper } from '@automapper/nestjs';
import { Mapper } from '@automapper/core';
import {
  BaseUserDto,
  ConnectionStatusEnum,
  PaginatedSearchQuery,
} from 'shared';
import { Connection } from '../connection/connection.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Connection)
    private readonly connectionRepository: Repository<Connection>,
    @InjectMapper() private readonly mapper: Mapper,
  ) {}

  async getUser(id: number) {
    const userEntity = await this.userRepository.findOneBy({
      id,
    });
    return await this.mapper.mapAsync(userEntity, User, BaseUserDto);
  }

  async getUsers(query: PaginatedSearchQuery, currentUserId: number) {
    const connectedUserIds = (
      await this.connectionRepository
        .createQueryBuilder('connection')
        .innerJoin('connection.recipient', 'recipient')
        .innerJoin('connection.requester', 'requester')
        .select([
          'connection.id',
          'connection.status',
          'recipient.id',
          'requester.id',
        ])
        .where('connection.status = :status', {
          status: ConnectionStatusEnum.ACCEPTED,
        })
        .getMany()
    ).reduce((ids, connection) => {
      if (connection.requester.id === currentUserId) {
        ids.push(connection.recipient.id);
      } else {
        ids.push(connection.requester.id);
      }
      return ids;
    }, [] as number[]);

    const userQuery = this.userRepository
      .createQueryBuilder('user')
      .where('user.id NOT IN (:...connectedUserIds)', { connectedUserIds });

    const result = await paginate(query, userQuery, USER_PAGINATION_CONFIG);
    return {
      ...result,
      data: await this.mapper.mapArrayAsync(result.data, User, BaseUserDto),
    };
  }
}
