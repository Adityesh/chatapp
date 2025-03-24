import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection } from 'src/connection/connection.entity';
import { Repository } from 'typeorm';
import {
  BaseConnectionDto,
  ConnectionStatusEnum,
  PaginatedSearchQuery,
  UpdateConnectionDto,
} from 'shared';
import { InjectMapper } from '@automapper/nestjs';
import { Mapper } from '@automapper/core';
import { CONNECTION_PAGINATION_CONFIG } from '../common/utils/pagination';
import { paginate } from 'nestjs-paginate';
import { ChannelService } from '../channel/channel.service';

@Injectable()
export class ConnectionService {
  constructor(
    @InjectRepository(Connection)
    private readonly connectionRepository: Repository<Connection>,
    @InjectMapper() private readonly mapper: Mapper,
    private readonly channelService: ChannelService,
  ) {}

  async createConnection(requester: number, recipient: number) {
    const existingConn = await this.getConnection(requester, recipient);
    if (existingConn) {
      throw new BadRequestException('Connection already exists');
    }
    const insertResult = await this.connectionRepository
      .createQueryBuilder()
      .insert()
      .into(Connection)
      .values({
        requester: { id: requester },
        recipient: { id: recipient },
      })
      .returning(['requester', 'recipient', 'status'])
      .execute();
    return !!insertResult;
  }

  async updateConnection({ id, status }: UpdateConnectionDto) {
    const connectionEntity = await this.connectionRepository
      .createQueryBuilder('connection')
      .where('connection.id = :id', { id })
      .innerJoin('connection.requester', 'requester')
      .innerJoin('connection.recipient', 'recipient')
      .select([
        'connection.id',
        'connection.status',
        'requester.id',
        'recipient.id',
      ])
      .getOne();

    connectionEntity.status = status;
    const updatedResult =
      await this.connectionRepository.save(connectionEntity);

    if (status === ConnectionStatusEnum.ACCEPTED && updatedResult !== null) {
      return !!(await this.channelService.createDirectChannel([
        updatedResult.requester.id,
        updatedResult.recipient.id,
      ]));
    }

    return !!updatedResult;
  }

  async getConnection(currentUserId: number, userId: number) {
    const connection = await this.connectionRepository
      .createQueryBuilder('connection')
      .innerJoinAndSelect('connection.recipient', 'recipient')
      .innerJoinAndSelect('connection.requester', 'requester')
      .where(
        '(requester.id = :requesterId AND recipient.id = :recipientId) OR (requester.id = :recipientId AND recipient.id = :requesterId)',
        {
          requesterId: currentUserId,
          recipientId: userId,
        },
      )
      .getOne();
    return await this.mapper.mapAsync(
      connection,
      Connection,
      BaseConnectionDto,
    );
  }

  async getAllConnections(query: PaginatedSearchQuery) {
    const baseQuery = this.connectionRepository
      .createQueryBuilder('connection')
      .where('connection.status != :status', {
        status: ConnectionStatusEnum.ACCEPTED,
      });
    const result = await paginate(
      query,
      baseQuery,
      CONNECTION_PAGINATION_CONFIG,
    );
    return {
      ...result,
      data: await this.mapper.mapArrayAsync(
        result.data,
        Connection,
        BaseConnectionDto,
      ),
    };
  }

  async deleteConnection(connectionId: number, currentUserId: number) {
    const connectionEntity = await this.connectionRepository
      .createQueryBuilder('connection')
      .where('connection.id = :connectionId', { connectionId })
      .innerJoinAndSelect('connection.requester', 'requester')
      .getOne();

    if (connectionEntity.requester.id !== currentUserId) {
      throw new ForbiddenException(
        'You are not authorized to delete the connection',
      );
    }

    const deleted = await this.connectionRepository.remove(connectionEntity);
    return !!deleted;
  }
}
