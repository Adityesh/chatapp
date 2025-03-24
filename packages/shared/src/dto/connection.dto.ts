import { IsEnum, IsNumber, IsOptional, IsPositive } from "class-validator";
import { ConnectionStatusEnum } from "../enums";
import { BaseApiResponseDto, BaseEntityDto } from "./common.dto";
import { BooleanResponseType } from "../types";
import { BaseUserDto } from "./user.dto";
import { AutoMap } from "@automapper/classes";
import { Paginated } from "nestjs-paginate";

export class BaseConnectionDto extends BaseEntityDto {
  @AutoMap(() => BaseUserDto)
  requester: BaseUserDto;

  @AutoMap(() => BaseUserDto)
  recipient: BaseUserDto;

  @AutoMap(() => String)
  @IsEnum(ConnectionStatusEnum)
  status: ConnectionStatusEnum;
}

export class GetConnectionDto extends BaseApiResponseDto<BaseConnectionDto | null> {}

export class CreateConnectionDto {
  @IsNumber()
  @IsPositive()
  recipient: number;
}

export class CreateConnectionResponseDto extends BaseApiResponseDto<BooleanResponseType> {}

export class UpdateConnectionDto {
  @IsNumber()
  id: number;

  @IsNumber()
  @IsOptional()
  requester?: number;

  @IsOptional()
  @IsOptional()
  recipient?: number;

  @IsEnum(ConnectionStatusEnum)
  status?: ConnectionStatusEnum;
}

export class UpdateConnectionResponseDto extends BaseApiResponseDto<BooleanResponseType> {}

export class GetConnectionsPaginatedResponseDto extends BaseApiResponseDto<
  Paginated<BaseConnectionDto>
> {}

export class DeleteConnectionResponseDto extends BaseApiResponseDto<BooleanResponseType> {}
