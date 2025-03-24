import { baseApi } from "@/store/api/baseApi.ts";
import {
  GetConnectionResponse,
  GetConnectionRequest,
  CreateConnectionRequest,
  CreateConnectionResponse,
  UpdateConnectionRequest,
  UpdateConnectionResponse,
  GetConnectionsRequest,
  GetConnectionsResponse,
  GetUsersRequest,
  DeleteConnectionRequest,
  DeleteConnectionResponse,
} from "shared";
import {
  CONNECTIONS_CONTROLLER,
  HTTP_METHODS,
} from "@/constants/url.constants.ts";
import {
  generatePaginationFilterObj,
  getInfiniteQueryOptions,
  objToQuery,
} from "@/utils";

const connectionApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getConnectionWithUser: builder.query<
      GetConnectionResponse,
      GetConnectionRequest
    >({
      query: ({ id }) => ({
        url: CONNECTIONS_CONTROLLER.GET_CONNECTION.replace(
          "{userId}",
          id!.toString(),
        ),
      }),
      providesTags: ["getConnectionWithUser"],
    }),
    createConnection: builder.mutation<
      CreateConnectionResponse,
      CreateConnectionRequest
    >({
      query: (body) => ({
        url: CONNECTIONS_CONTROLLER.CREATE_CONNECTION,
        method: HTTP_METHODS.POST,
        body,
      }),
      invalidatesTags: ["getConnectionWithUser", "getConnections"],
    }),
    updateConnection: builder.mutation<
      UpdateConnectionResponse,
      UpdateConnectionRequest
    >({
      query: (body) => ({
        url: CONNECTIONS_CONTROLLER.UPDATE_CONNECTION,
        method: HTTP_METHODS.PATCH,
        body,
      }),
      invalidatesTags: ["getConnectionWithUser", "getConnections"],
    }),
    getAllConnections: builder.infiniteQuery<
      GetConnectionsResponse,
      GetConnectionsRequest,
      number
    >({
      infiniteQueryOptions: getInfiniteQueryOptions<GetConnectionsResponse>(),
      query({ queryArg: { filter, ...rest }, pageParam }) {
        const queryObj = {
          ...rest,
          page: pageParam,
        } as GetUsersRequest;
        return (
          CONNECTIONS_CONTROLLER.GET_ALL_CONNECTIONS +
          objToQuery({ ...queryObj, ...generatePaginationFilterObj(filter) })
        );
      },
      providesTags: ["getConnections"],
    }),
    deleteConnection: builder.mutation<
      DeleteConnectionResponse,
      DeleteConnectionRequest
    >({
      query: ({ id }) => ({
        url: CONNECTIONS_CONTROLLER.DELETE_CONNECTION.replace(
          "{connectionId}",
          id!.toString(),
        ),
        method: HTTP_METHODS.DELETE,
      }),
      invalidatesTags: ["getConnections", "getConnectionWithUser"],
    }),
  }),
});

export const {
  useGetConnectionWithUserQuery,
  useCreateConnectionMutation,
  useGetAllConnectionsInfiniteQuery,
  useUpdateConnectionMutation,
  useDeleteConnectionMutation,
} = connectionApi;
