import { BaseApiResponseDto, BaseEntityDto } from "./common.dto";
import { BaseMessageStatusDto } from "./messagestatus.dto";
import { BaseMessageAttachmentDto } from "./messageattachment.dto";
import { BaseUserDto } from "./user.dto";
import { BaseChannelDto } from "./channel.dto";
import { AutoMap } from "@automapper/classes";
import { IsNumber, IsOptional, IsString } from "class-validator";
import { BooleanResponseType } from "../types";
import { Paginated } from "nestjs-paginate";

export class BaseMessageDto extends BaseEntityDto {
  @AutoMap()
  content: string;

  @AutoMap(() => BaseUserDto)
  sender: BaseUserDto;

  @AutoMap(() => BaseChannelDto)
  channel: BaseChannelDto;

  @AutoMap()
  isEdited: boolean;

  @AutoMap(() => BaseMessageDto)
  replyTo: BaseMessageDto | null;

  @AutoMap(() => [BaseMessageStatusDto])
  messageStatus: BaseMessageStatusDto[];

  @AutoMap(() => [BaseMessageAttachmentDto])
  attachments: BaseMessageAttachmentDto[];
}

export class CreateMessageDto {
  @IsNumber()
  channelId: number;

  @IsNumber()
  @IsOptional()
  replyTo?: number;

  @IsString()
  content: string;
}

export class CreateMessageResponseDto extends BaseApiResponseDto<BaseMessageDto> {}

export class EditMessageDto {
  @IsString()
  content: string;

  @IsNumber()
  messageId: number;
}

export class EditMessageResponseDto extends BaseApiResponseDto<BaseMessageDto> {}

export class DeleteMessageDto {
  @IsNumber()
  channelId: number;

  @IsNumber()
  messageId: number;
}

export class DeleteMessageResponseDto extends BaseApiResponseDto<BooleanResponseType> {}

export class GetMessagesPaginatedResponseDto extends BaseApiResponseDto<
  Paginated<BaseMessageDto>
> {}
