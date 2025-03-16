import { GetByIdType, PaginatedSearchQuery } from "./common.types";
import { GetUserDto, GetUsersPaginatedDto } from "../dto";

export type GetUserRequest = GetByIdType;
export type GetUserResponse = InstanceType<typeof GetUserDto>;

export type GetUsersRequest = PaginatedSearchQuery & {};
export type GetUsersResponse = InstanceType<typeof GetUsersPaginatedDto>;