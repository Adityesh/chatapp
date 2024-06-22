import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { GoogleUserDto } from 'src/dto/google-user.dto';
import {
  LoginUserLocalDto,
  RegisterLocalUserDto,
} from 'src/dto/local-user.dto';
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

  async authenticateUserLocal({ userName, password }: LoginUserLocalDto) {
    const userExists = await this.userRepository.findOneBy({
      userName,
    });

    if (!userExists) {
      throw new BadRequestException(null, "User doesn't exist");
    }

    const passwordValid = await bcrypt.compare(password, userExists.password);

    if (!passwordValid) {
      throw new UnauthorizedException(null, 'Invalid password');
    }

    return {
      ...userExists,
      password: undefined,
    };
  }

  async findUserById(id: number) {
    return await this.userRepository.findOne({
      select: [
        'id',
        'avatarUrl',
        'createdAt',
        'email',
        'fullName',
        'googleId',
        'isDeleted',
        'updatedAt',
        'userName',
      ],
      where: {
        id,
      },
    });
  }

  async findUserByUsername(userName: string) {
    return await this.userRepository.findOneBy({ userName });
  }

  async registerLocalUser({
    email,
    userName,
    fullName,
    password,
  }: RegisterLocalUserDto) {
    const userNameExists = await this.userRepository.findOneBy({
      userName,
    });

    if (userNameExists) {
      throw new BadRequestException(null, 'Username already exists');
    }

    const userEmailExists = await this.userRepository.findOneBy({
      email,
    });

    if (userEmailExists) {
      throw new BadRequestException(null, 'Email already exists');
    }

    const newLocalUser = this.userRepository.create({
      email,
      fullName,
      userName,
      password,
    });

    await this.userRepository.save(newLocalUser);
    return true;
  }
}
