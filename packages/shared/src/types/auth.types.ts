import { LoginUserDto, RegisterUserDto } from '../dto';

export type RegisterUserRequest = InstanceType<typeof RegisterUserDto>;


export type LoginUserRequest = InstanceType<typeof LoginUserDto>;