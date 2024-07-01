import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SendConnectionDto, UpdateConnectionDto } from '@repo/shared';
import { IPaginationOptions, paginate } from 'nestjs-typeorm-paginate';
import { Connection } from 'src/entities/connection.entity';
import { User } from 'src/entities/user.entity';
import { ConnectionStatusEnum } from '@repo/shared';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRespository: Repository<User>,
    @InjectRepository(Connection)
    private readonly connectionRepository: Repository<Connection>,
  ) {}

  // TODO - ADD FILTERS AND PAGINATION TO THIS SERVICE CALL
  async searchUsers(
    currentUserId: number,
    options: IPaginationOptions,
    query: string,
  ) {
    const baseQuery = this.userRespository
      .createQueryBuilder('users')
      .where('users.userName ILIKE :searchTerm', { searchTerm: `%${query}%` })
      .orWhere('users.fullName ILIKE :searchTerm', { searchTerm: `%${query}%` })
      .andWhere('users.id <> :currentUserId', { currentUserId })
      .select([
        'users.id',
        'users.userName',
        'users.fullName',
        'users.avatarUrl',
      ]);

    return paginate<User>(baseQuery, options);
  }

  async getUser(userId: number) {
    const user = await this.userRespository.findOneBy({
      id: userId,
    });
    user.password = undefined;

    return user;
  }

  async sendConnectionInvite({ addressedTo, requestedBy }: SendConnectionDto) {
    const doesExist = await this.connectionRepository.findOne({
      where: [
        {
          addressedTo: {
            id: addressedTo,
          },
          requestedBy: {
            id: requestedBy,
          },
        },
      ],
    });

    if (doesExist) {
      const { status } = doesExist;
      switch (status) {
        case ConnectionStatusEnum.ACCEPTED:
          throw new BadRequestException(
            'You are already connected with the user.',
          );
        case ConnectionStatusEnum.BLOCKED:
          throw new BadRequestException(
            'User has blocked you from connecting.',
          );
        case ConnectionStatusEnum.PENDING:
          throw new BadRequestException('Invitaion is still pending');
        case ConnectionStatusEnum.DECLINED:
          throw new BadRequestException('Invitation has been declined.');
      }
    }

    return await this.connectionRepository
      .createQueryBuilder()
      .insert()
      .into(Connection)
      .values({
        addressedTo: {
          id: addressedTo,
        },
        requestedBy: {
          id: requestedBy,
        },
      })
      .execute();
  }

  async updateConnectionInvite({ status, connectionId }: UpdateConnectionDto) {
    return await this.connectionRepository
      .createQueryBuilder('Connections')
      .update(Connection)
      .set({
        status: status as ConnectionStatusEnum,
      })
      .where('id = :connectionId', { connectionId })
      .execute();
  }

  async getConnectionWithUser(userOne: number, userTwo: number) {
    // Get connection detail between userOne and userTwo
    // userOne is the one making the request i.e logged in user
    const result = await this.connectionRepository
      .createQueryBuilder('connection')
      .innerJoinAndSelect('connection.addressedTo', 'addressedTo')
      .innerJoinAndSelect('connection.requestedBy', 'requestedBy')
      .select([
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
      ])
      .where(
        '(connection.addressedTo = :userOne AND connection.requestedBy = :userTwo) OR (connection.addressedTo = :userTwo AND connection.requestedBy = :userOne)',
        { userOne, userTwo: Number(userTwo) },
      )
      .getOne();

    return result;
  }
}
