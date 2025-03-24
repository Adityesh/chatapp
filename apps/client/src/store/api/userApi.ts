import { baseApi } from "@/store/api/baseApi.ts";
import {
  GetCurrentUserRequest,
  GetCurrentUserResponse,
  GetUserRequest,
  GetUserResponse,
  GetUsersRequest,
  GetUsersResponse,
} from "shared";
import { USER_CONTROLLER } from "@/constants/url.constants.ts";
import {
  generatePaginationFilterObj,
  getInfiniteQueryOptions,
  objToQuery,
} from "@/utils";

const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCurrentUser: builder.query<
      GetCurrentUserResponse,
      GetCurrentUserRequest
    >({
      query: () => ({
        url: USER_CONTROLLER.GET_CURRENT_USER,
      }),
      providesTags: ["getCurrentUser"],
    }),
    getUserById: builder.query<GetUserResponse, GetUserRequest>({
      query: ({ id }) => ({
        url: USER_CONTROLLER.GET_USER_BY_ID.replace("{userId}", id!.toString()),
      }),
      providesTags: ["getUserById"],
    }),
    getUsers: builder.infiniteQuery<GetUsersResponse, GetUsersRequest, number>({
      infiniteQueryOptions: getInfiniteQueryOptions<GetUsersResponse>(),
      query({ queryArg: { filter, ...rest }, pageParam }) {
        const queryObj = {
          ...rest,
          page: pageParam,
        } as GetUsersRequest;
        return (
          USER_CONTROLLER.GET_USERS +
          objToQuery({ ...queryObj, ...generatePaginationFilterObj(filter) })
        );
      },
      providesTags: ["getUsers"],
    }),
  }),
});

export const {
  useGetUserByIdQuery,
  useGetUsersInfiniteQuery,
  useGetCurrentUserQuery,
} = userApi;
