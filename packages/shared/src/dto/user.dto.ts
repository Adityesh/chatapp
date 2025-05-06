import { AutoMap } from "@automapper/classes";
import { BaseApiResponseDto, BaseEntityDto } from "./common.dto";
import { Paginated } from "nestjs-paginate";
import { IsDate, IsOptional, IsString, IsUrl } from "class-validator";
import { UserStatus } from "../enums";

export class BaseUserDto extends BaseEntityDto {
  @AutoMap()
  fullName: string;

  @AutoMap()
  userName: string;

  @AutoMap({ type: () => String })
  avatarUrl?: string | null;

  @AutoMap()
  email: string;

  @AutoMap()
  lastSeen: Date;

  status: UserStatus = "disconnected";
}

export class GetUserResponseDto extends BaseApiResponseDto<BaseUserDto> {}

export class GetUsersPaginatedResponseDto extends BaseApiResponseDto<
  Paginated<BaseUserDto>
> {}

export class GetCurrentUserResponseDto extends BaseApiResponseDto<BaseUserDto> {}

export class UpdateUserDto {
  @IsOptional()
  @IsDate()
  lastSeen?: Date;

  @IsOptional()
  @IsString()
  userName?: string;

  @IsOptional()
  @IsString()
  email?: string;

  @IsOptional()
  @IsString()
  fullName?: string;

  @IsOptional()
  @IsUrl()
  avatarUrl?: string;
}
