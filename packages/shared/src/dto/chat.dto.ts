import { IsNumber, IsOptional, IsString } from "class-validator";
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
