import {
  ClassProperties,
  GetByIdType,
  PaginatedSearchQuery,
} from "./common.types";
import {
  GetCurrentUserResponseDto,
  GetUserResponseDto,
  GetUsersPaginatedResponseDto,
} from "../dto";

export type GetUserRequest = GetByIdType;
export type GetUserResponse = ClassProperties<typeof GetUserResponseDto>;

export type GetUsersRequest = PaginatedSearchQuery & {};
export type GetUsersResponse = ClassProperties<
  typeof GetUsersPaginatedResponseDto
>;

export type GetCurrentUserRequest = void;
export type GetCurrentUserResponse = ClassProperties<
  typeof GetCurrentUserResponseDto
>;
