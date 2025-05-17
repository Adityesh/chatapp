import { BaseEntityDto } from "./common.dto";
import { BaseMessageDto } from "./message.dto";
import { AutoMap } from "@automapper/classes";
import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

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

export class InsertMessageAttachmentDto {
  @IsString()
  @IsNotEmpty()
  mimeType: string;

  @IsString()
  @IsNotEmpty()
  url: string;

  @IsNumber()
  @IsNotEmpty()
  size: number;

  @IsNumber()
  @IsNotEmpty()
  messageId: number;

  @IsString()
  @IsOptional()
  vendorId?: string;
}
