import { AutoMap } from "@automapper/classes";
import { BaseApiResponseDto, BaseEntityDto } from "./common.dto";
import { Paginated } from "nestjs-paginate";

export class BaseUserDto extends BaseEntityDto {
  @AutoMap()
  fullName: string;

  @AutoMap()
  userName: string;

  @AutoMap({ type: () => String })
  avatarUrl?: string | null;

  @AutoMap()
  email: string;
}

export class GetUserResponseDto extends BaseApiResponseDto<BaseUserDto> {}

export class GetUsersPaginatedResponseDto extends BaseApiResponseDto<
  Paginated<BaseUserDto>
> {}

export class GetCurrentUserResponseDto extends BaseApiResponseDto<BaseUserDto> {}
