import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Length,
} from "class-validator";
import { Type } from "class-transformer";

export class InitateChatDto {
  @IsNumber({ allowNaN: false })
  @Type(() => Number)
  senderId: number;

  @IsNumber({ allowNaN: false })
  @Type(() => Number)
  receiverId: number;
}

export class GetChatDetailsDto {
  @IsNumber({ allowNaN: false })
  @Type(() => Number)
  channelId: number;
}

export class SendMessageDto {
  @IsString()
  content: string;

  @IsNumber({ allowNaN: false })
  @Type(() => Number)
  senderId: number;
}

export class GetMessagesDto {
  @IsNumber({ allowNaN: false })
  @IsOptional()
  @Type(() => Number)
  limit: number;

  @IsNumber({ allowNaN: false })
  @IsOptional()
  @Type(() => Number)
  page: number;
}

export class GetChannelsDto {
  @IsNumber({ allowNaN: false })
  @IsOptional()
  @Type(() => Number)
  limit: number;

  @IsNumber({ allowNaN: false })
  @IsOptional()
  @Type(() => Number)
  page: number;
}

export class CreateChannelDto {
  @IsBoolean()
  @Type(() => Boolean)
  isGroup: boolean;

  @Length(1, 15)
  topic: string;

  @Length(1, 100)
  @IsOptional()
  description: string;

  @IsArray()
  @IsOptional()
  @IsNumber({}, { each: true })
  @ArrayMinSize(2)
  @ArrayMaxSize(20)
  @IsNotEmpty()
  channelUsers?: number[];
}
