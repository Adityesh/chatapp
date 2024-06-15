import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GoogleUserDto } from 'src/dto/google-user.dto';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async authenticateUser({
    email,
    picture,
    firstName,
    lastName,
    googleId,
  }: GoogleUserDto) {
    // Check if user exists in the database and create if not present
    const userExists = await this.userRepository.findOneBy({
      email,
    });

    // If found returning will complete the authentication
    if (userExists) return userExists;

    const createdUser = this.userRepository.create({
      avatarUrl: picture,
      email,
      fullName: firstName + ' ' + lastName,
      userName: firstName + lastName,
      googleId: googleId,
    });

    return await this.userRepository.save(createdUser);
  }

  async findUserById(id: number) {
    return await this.userRepository.findOneBy({ id });
  }
}
