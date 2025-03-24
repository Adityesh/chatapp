import { BaseEntityDto } from "./common.dto";
import { BaseMessageStatusDto } from "./messagestatus.dto";
import { BaseMessageAttachmentDto } from "./messageattachment.dto";
import { BaseUserDto } from "./user.dto";
import { BaseChannelDto } from "./channel.dto";
import { AutoMap } from "@automapper/classes";

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
  replyTo: BaseMessageDto;

  @AutoMap(() => [BaseMessageStatusDto])
  messageStatus: BaseMessageStatusDto[];

  @AutoMap(() => [BaseMessageAttachmentDto])
  attachments: BaseMessageAttachmentDto[];
}
