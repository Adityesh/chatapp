import { ClassProperties, PaginatedSearchQuery } from "./common.types";
import {
  GetChannelsPaginatedResponseDto,
} from "../dto";

export type GetChannelsRequest = PaginatedSearchQuery & {};
export type GetChannelsResponse = ClassProperties<
  typeof GetChannelsPaginatedResponseDto
>;
