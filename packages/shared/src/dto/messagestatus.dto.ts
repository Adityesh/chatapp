import { BaseEntityDto } from "./common.dto";
import { MessageStatusEnum } from "../enums";
import { IsEnum } from "class-validator";
import { BaseMessageDto } from "./message.dto";
import { BaseUserDto } from "./user.dto";
import { AutoMap } from "@automapper/classes";

export class BaseMessageStatusDto extends BaseEntityDto {
  @AutoMap(() => BaseMessageDto)
  message: BaseMessageDto;

  @AutoMap(() => BaseUserDto)
  user: BaseUserDto;

  @AutoMap(() => String)
  @IsEnum(MessageStatusEnum)
  status: MessageStatusEnum;

  @AutoMap(() => Date)
  deliveredAt: Date;

  @AutoMap(() => Date)
  readAt: Date;

  @AutoMap()
  error: string;
}
