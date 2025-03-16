import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/user.entity';
import { Repository } from 'typeorm';
import { paginate } from 'nestjs-paginate';
import { USER_PAGINATION_CONFIG } from '../common/utils/pagination';
import { InjectMapper } from '@automapper/nestjs';
import { Mapper } from '@automapper/core';
import { BaseUserDto, PaginatedSearchQuery } from 'shared';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectMapper() private readonly mapper: Mapper,
  ) {}

  async getUser(id: number) {
    const userEntity = await this.userRepository.findOneBy({
      id,
    });
    return await this.mapper.mapAsync(userEntity, User, BaseUserDto);
  }

  async getUsers(query: PaginatedSearchQuery) {
    const result = await paginate(
      query,
      this.userRepository,
      USER_PAGINATION_CONFIG,
    );
    return {
      ...result,
      data: await this.mapper.mapArrayAsync(result.data, User, BaseUserDto),
    };
  }
}
