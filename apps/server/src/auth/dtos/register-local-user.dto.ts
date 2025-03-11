import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
  MaxLength,
  MinLength,
} from 'class-validator';

export class RegisterLocalUserDto {
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
