import { BaseApiResponseDto, BaseEntityDto } from "./common.dto";
import { ChannelTypeEnum } from "../enums";
import { BaseMessageDto } from "./message.dto";
import { BaseUserDto } from "./user.dto";
import { BaseChannelUserDto } from "./channeluser.dto";
import { AutoMap } from "@automapper/classes";
import { IsEnum } from "class-validator";
import { Paginated } from "nestjs-paginate";

export class BaseChannelDto extends BaseEntityDto {
  @AutoMap()
  topic: string;

  @AutoMap()
  description: string;

  @AutoMap(() => String)
  @IsEnum(ChannelTypeEnum)
  channelType: ChannelTypeEnum;

  @AutoMap()
  channelAvatar: string;

  @AutoMap(() => [BaseMessageDto])
  channelMessages: BaseMessageDto[];

  @AutoMap(() => BaseUserDto)
  createdBy: BaseUserDto;

  @AutoMap(() => [BaseChannelUserDto])
  users: BaseChannelUserDto[];

  totalUsers?: number;
}

export class GetChannelsPaginatedResponseDto extends BaseApiResponseDto<
  Paginated<BaseChannelDto>
> {}

export class GetChannelResponseDto extends BaseApiResponseDto<BaseChannelDto> {}
