import {
  ClassProperties,
  GetByIdType,
  PaginatedSearchQuery,
} from "./common.types";
import {
  CreateConnectionDto,
  CreateConnectionResponseDto,
  DeleteConnectionResponseDto,
  GetConnectionDto,
  GetConnectionsPaginatedResponseDto,
  UpdateConnectionDto,
  UpdateConnectionResponseDto,
} from "../dto";

export type GetConnectionRequest = GetByIdType;
export type GetConnectionResponse = ClassProperties<typeof GetConnectionDto>;

export type CreateConnectionRequest = ClassProperties<
  typeof CreateConnectionDto
>;
export type CreateConnectionResponse = ClassProperties<
  typeof CreateConnectionResponseDto
>;

export type UpdateConnectionRequest = ClassProperties<
  typeof UpdateConnectionDto
>;
export type UpdateConnectionResponse = ClassProperties<
  typeof UpdateConnectionResponseDto
>;

export type GetConnectionsRequest = PaginatedSearchQuery & {};
export type GetConnectionsResponse = ClassProperties<
  typeof GetConnectionsPaginatedResponseDto
>;

export type DeleteConnectionRequest = GetByIdType;
export type DeleteConnectionResponse = ClassProperties<
  typeof DeleteConnectionResponseDto
>;
