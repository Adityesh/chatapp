import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GetConnectionsDto } from '@repo/shared';
import { paginate } from 'nestjs-typeorm-paginate';
import { Connection } from 'src/entities/connection.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ConnectionService {
  constructor(
    @InjectRepository(Connection)
    private readonly connectionRepository: Repository<Connection>,
  ) {}

  async getConnections(
    loggedInUserId: number,
    { limit, page, status, type }: GetConnectionsDto,
  ) {
    let baseQuery = this.connectionRepository
      .createQueryBuilder('connection')
      .innerJoin('connection.requestedBy', 'requestedBy')
      .innerJoin('connection.addressedTo', 'addressedTo')
      .addSelect([
        'connection.id',
        'connection.status',
        'connection.createdAt',
        'connection.updatedAt',
        'addressedTo.id',
        'addressedTo.userName',
        'addressedTo.fullName',
        'addressedTo.avatarUrl',
        'requestedBy.id',
        'requestedBy.userName',
        'requestedBy.fullName',
        'requestedBy.avatarUrl',
      ]);

    if (status) {
      baseQuery = baseQuery.where('connection.status = :status', { status });
    }

    if (type) {
      switch (type) {
        case 'requested':
          baseQuery = baseQuery.where('requestedBy.id = :loggedInUserId', {
            loggedInUserId,
          });
          break;

        case 'sent':
          baseQuery = baseQuery.where('addressedTo.id = :loggedInUserId', {
            loggedInUserId,
          });

          break;

        default:
          break;
      }
    }

    return await paginate(baseQuery, { limit, page });
  }
}
