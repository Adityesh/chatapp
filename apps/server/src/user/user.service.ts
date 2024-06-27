import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRespository: Repository<User>,
  ) {}

  // TODO - ADD FILTERS AND PAGINATION TO THIS SERVICE CALL
  searchUsers() {
    return this.userRespository.find({
      select: {
        avatarUrl: true,
        createdAt: true,
        deletedAt: true,
        email: true,
        fullName: true,
        id: true,
        isDeleted: true,
        updatedAt: true,
        userName: true,
      },
    });
  }
}
