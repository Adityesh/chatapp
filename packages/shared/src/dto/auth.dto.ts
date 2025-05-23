import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
  IsStrongPassword,
} from "class-validator";
import { BaseApiResponseDto } from "./common.dto";
import { BooleanResponseType } from "../types";

export class RegisterUserDto {
  @IsNotEmpty()
  @MinLength(4)
  @MaxLength(20)
  userName: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(20)
  @IsStrongPassword({
    minLength: 8,
    minLowercase: 1,
    minNumbers: 1,
    minSymbols: 1,
    minUppercase: 1,
  })
  password: string;

  @IsNotEmpty()
  fullName: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;
}

export class RegisterUserResponseDto extends BaseApiResponseDto<BooleanResponseType> {}

export class LoginUserDto {
  @IsNotEmpty()
  userName: string;

  @IsNotEmpty()
  password: string;
}

export class LoginUserResponseDto extends BaseApiResponseDto<void> {}
