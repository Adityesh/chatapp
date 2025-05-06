import { IsInstance, IsNumber, IsOptional, IsString } from "class-validator";
import { AutoMap } from "@automapper/classes";

export class BaseErrorDto {
  @IsString()
  message: string;

  @IsString()
  @IsOptional()
  cause?: string;

  @IsString()
  @IsOptional()
  name?: string;
}

export class BaseApiResponseDto<T> {
  data: T;

  @IsNumber()
  statusCode: number;

  @IsString()
  path: string;

  @IsString()
  timestamp: string;

  @IsInstance(BaseErrorDto)
  error?: BaseErrorDto;
}

export class BaseEntityDto {
  @AutoMap()
  id: number;

  @AutoMap()
  createdAt: Date;

  @AutoMap()
  updatedAt: Date;

  @AutoMap()
  deletedAt: Date;

  @AutoMap()
  isDeleted: boolean;
}
