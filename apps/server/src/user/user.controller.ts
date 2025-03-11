import { Controller, Get, Param } from '@nestjs/common';
import { UserService } from './user.service';
import { Paginate, Paginated, PaginateQuery } from 'nestjs-paginate';
import { User } from './user.entity';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(':id')
  async getUser(@Param('id') id: number): Promise<User> {
    return this.userService.getUser(id);
  }

  @Get('')
  async getAll(@Paginate() query: PaginateQuery): Promise<Paginated<User>> {
    return this.userService.getUsers(query);
  }
}
