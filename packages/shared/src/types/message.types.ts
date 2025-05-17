import { ClassProperties, PaginatedSearchQuery } from "./common.types";
import {
  CreateMessageDto,
  CreateMessageResponseDto,
  DeleteMessageDto,
  DeleteMessageResponseDto,
  EditMessageDto,
  EditMessageResponseDto,
  GetMessagesPaginatedResponseDto,
} from "../dto";

export type CreateMessageRequest = ClassProperties<typeof CreateMessageDto> & {
  files?: FileList | null;
};
export type CreateMessageResponse = ClassProperties<
  typeof CreateMessageResponseDto
>;

export type EditMessageRequest = ClassProperties<typeof EditMessageDto> & {
  files?: FileList | null;
};
export type EditMessageResponse = ClassProperties<
  typeof EditMessageResponseDto
>;

export type DeleteMessageRequest = ClassProperties<typeof DeleteMessageDto>;
export type DeleteMessageResponse = ClassProperties<
  typeof DeleteMessageResponseDto
>;

export type GetMessagesRequest = PaginatedSearchQuery & { channelId: number };
export type GetMessagesResponse = ClassProperties<
  typeof GetMessagesPaginatedResponseDto
>;
