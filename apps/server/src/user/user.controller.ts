import { Controller, Get, Param } from '@nestjs/common';
import { UserService } from './user.service';
import { Paginate, Paginated } from 'nestjs-paginate';
import { User } from './user.entity';
import { GetByIdDto, SearchPaginationQuery } from 'shared';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(':id')
  async getUser(@Param('id') { id }: GetByIdDto): Promise<User> {
    return this.userService.getUser(id);
  }

  @Get('')
  async getAll(
    @Paginate() query: SearchPaginationQuery,
  ): Promise<Paginated<User>> {
    return this.userService.getUsers(query);
  }
}
