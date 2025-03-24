import { BaseEntityDto } from "./common.dto";
import { BaseMessageDto } from "./message.dto";
import { AutoMap } from "@automapper/classes";

export class BaseMessageAttachmentDto extends BaseEntityDto {
  @AutoMap()
  mimeType: string;

  @AutoMap()
  url: string;

  @AutoMap()
  size: number;

  @AutoMap(() => BaseMessageDto)
  message: BaseMessageDto;
}
