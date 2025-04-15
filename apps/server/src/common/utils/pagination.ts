import { PaginateConfig } from 'nestjs-paginate';
import { User } from '../../user/user.entity';
import { Connection } from '../../connection/connection.entity';
import { Channel } from '../../channel/channel.entity';
import { Message } from '../../message/message.entity';

export const USER_PAGINATION_CONFIG: PaginateConfig<User> = {
  sortableColumns: ['id', 'fullName', 'email', 'userName'],
  nullSort: 'last',
  defaultSortBy: [['id', 'DESC']],
  searchableColumns: ['fullName', 'email', 'userName'],
  defaultLimit: 10,
  cursorableColumns: ['id'],
};

export const CONNECTION_PAGINATION_CONFIG: PaginateConfig<Connection> = {
  sortableColumns: ['id', 'createdAt', 'updatedAt'],
  defaultSortBy: [['createdAt', 'DESC']],
  filterableColumns: {
    status: true,
    'recipient.id': true,
    'requester.id': true,
  },
  relations: ['recipient', 'requester'],
};

export const CHANNEL_PAGINATION_CONFIG: PaginateConfig<Channel> = {
  sortableColumns: ['id', 'createdAt', 'updatedAt'],
  defaultSortBy: [['updatedAt', 'DESC']],
  filterableColumns: {
    'users.user.id': true,
    channelType: true,
  },
};

export const MESSAGE_PAGINATION_CONFIG: PaginateConfig<Message> = {
  sortableColumns: ['id', 'createdAt', 'updatedAt'],
  defaultSortBy: [['updatedAt', 'DESC']],
};