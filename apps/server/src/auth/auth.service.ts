import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { User } from 'src/user/user.entity';
import { Repository } from 'typeorm';
import { GoogleUserDto } from './dtos/google-user.dto';
import { LoginUserDto, RegisterUserDto } from 'shared';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly cloudinaryService: CloudinaryService,
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

  async authenticateUserLocal({ userName, password }: LoginUserDto) {
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

  async registerUser(
    { email, userName, fullName, password }: RegisterUserDto,
    avatarUrl?: Express.Multer.File,
  ) {
    let newAvatarUrl = '';
    if (avatarUrl) {
      newAvatarUrl = (await this.cloudinaryService.uploadFile(avatarUrl)).url;
    }

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
      avatarUrl: newAvatarUrl,
    });

    const result = await this.userRepository.save(newLocalUser);
    return !!result;
  }
}
