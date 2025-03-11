import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/user.entity';
import { Repository } from 'typeorm';
import { paginate, Paginated, PaginateQuery } from 'nestjs-paginate';
import { USER_PAGINATION_CONFIG } from '../common/utils/pagination';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async getUser(id: number) {
    return await this.userRepository.findOneBy({
      id,
    });
  }

  async getUsers(query: PaginateQuery): Promise<Paginated<User>> {
    return await paginate(query, this.userRepository, USER_PAGINATION_CONFIG);
  }
}
