import {
  ClassProperties,
  GetByIdType,
  PaginatedSearchQuery,
} from "./common.types";
import { GetChannelResponseDto, GetChannelsPaginatedResponseDto } from "../dto";

export type GetChannelsRequest = PaginatedSearchQuery & {
  currentUser?: boolean;
};
export type GetChannelsResponse = ClassProperties<
  typeof GetChannelsPaginatedResponseDto
>;

export type GetChannelRequest = GetByIdType;
export type GetChannelResponse = ClassProperties<typeof GetChannelResponseDto>;
