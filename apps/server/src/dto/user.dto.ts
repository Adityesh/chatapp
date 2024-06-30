import { Transform, Type } from 'class-transformer';
import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';
import { ConnectionStatusEnum } from 'src/enums/connection.enum';

export class GetUserDto {
  @IsPositive()
  @Type(() => Number)
  userId: number;
}

export class SendConnectionDto {
  @IsPositive()
  @Type(() => Number)
  requestedBy: number;

  @IsPositive()
  @Type(() => Number)
  addressedTo: number;
}

export class UpdateConnectionDto {
  @IsEnum(ConnectionStatusEnum)
  @Transform(({ value }) => value.toLowerCase())
  status: ConnectionStatusEnum;

  @IsPositive()
  @Type(() => Number)
  connectionId: number;
}

export class GetConnectionWithUserDto {
  @IsPositive()
  @Type(() => Number)
  userId: number;
}

export class SearchUsersDto {
  @IsNumber({ allowNaN: false })
  @IsOptional()
  @Type(() => Number)
  limit: number;

  @IsNumber({ allowNaN: false })
  @IsOptional()
  @Type(() => Number)
  page: number;

  @IsString()
  @IsOptional()
  query: string;
}
