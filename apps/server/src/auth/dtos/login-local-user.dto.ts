import { IsNotEmpty } from 'class-validator';

export class LoginUserLocalDto {
  @IsNotEmpty()
  userName: string;

  @IsNotEmpty()
  password: string;
}
