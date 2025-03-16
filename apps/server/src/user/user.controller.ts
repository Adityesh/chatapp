import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  ValidationPipe,
} from '@nestjs/common';
import { UserService } from './user.service';
import { Paginate } from 'nestjs-paginate';
import { PaginatedSearchQuery } from 'shared';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(':id')
  async getUser(@Param('id', ParseIntPipe) id: number) {
    return this.userService.getUser(id);
  }

  @Get('')
  async getAll(@Paginate(ValidationPipe) query: PaginatedSearchQuery) {
    return await this.userService.getUsers(query);
  }
}
