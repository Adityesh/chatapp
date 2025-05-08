import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Req,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { UserService } from './user.service';
import { Paginate } from 'nestjs-paginate';
import { PaginatedSearchQuery, UpdateUserDto } from 'shared';
import { ProtectedGuard } from '../auth/guards/protected.guard';
import { Request } from 'express';

@Controller('user')
@UseGuards(ProtectedGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('current')
  async getCurrentUser(@Req() req: Request) {
    return this.userService.getUser(Number(req.user['id']));
  }

  @Get(':id')
  async getUser(@Param('id', ParseIntPipe) id: number) {
    return this.userService.getUser(id);
  }

  @Get('')
  async getAll(
    @Paginate(ValidationPipe) query: PaginatedSearchQuery,
    @Req() req: Request,
  ) {
    return this.userService.getUsers(query, req.user['id']);
  }

  @Patch(':id')
  async updateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body(ValidationPipe) updateUserDto: UpdateUserDto,
  ) {
    return this.userService.updateUser(id, updateUserDto);
  }
}
