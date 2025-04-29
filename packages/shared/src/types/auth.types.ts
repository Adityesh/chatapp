import {
  LoginUserDto,
  LoginUserResponseDto,
  RegisterUserDto,
  RegisterUserResponseDto,
} from "../dto";
import { ClassProperties } from "./common.types";

export type RegisterUserRequest = ClassProperties<typeof RegisterUserDto> & {
  avatar?: File;
};
export type RegisterUserResponse = ClassProperties<
  typeof RegisterUserResponseDto
>;

export type LoginUserRequest = ClassProperties<typeof LoginUserDto>;
export type LoginUserResponse = ClassProperties<typeof LoginUserResponseDto>;
