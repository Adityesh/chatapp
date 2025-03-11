import { PaginateConfig } from 'nestjs-paginate';
import { User } from '../../user/user.entity';

export const USER_PAGINATION_CONFIG: PaginateConfig<User> = {
  sortableColumns: ['id', 'fullName', 'email', 'userName'],
  nullSort: 'last',
  defaultSortBy: [['id', 'DESC']],
  searchableColumns: ['fullName', 'email', 'userName'],
  select: ['id', 'userName', 'fullName', 'avatarUrl', 'email'],
  defaultLimit: 5,
  cursorableColumns: ['id'],
};
