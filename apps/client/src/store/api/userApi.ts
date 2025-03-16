import { baseApi } from "@/store/api/baseApi.ts";
import {
  GetUserRequest,
  GetUserResponse,
  GetUsersRequest,
  GetUsersResponse,
} from "shared";
import { USER_CONTROLLER } from "@/constants/url.constants.ts";
import { objToQuery } from "@/utils";

const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getUserById: builder.query<GetUserResponse, GetUserRequest>({
      query: ({ id }) => ({
        url: USER_CONTROLLER.GET_USER_BY_ID.replace("{0}", id!.toString()),
      }),
    }),
    getUsers: builder.infiniteQuery<GetUsersResponse, GetUsersRequest, number>({
      infiniteQueryOptions: {
        initialPageParam: 1,
        getNextPageParam: ({ data }, _allPages, lastPageParam) => {
          const totalPages = data && data?.meta?.totalPages;
          const currentPage = data && data?.meta?.currentPage;
          if (totalPages && totalPages === currentPage) {
            return undefined;
          }
          return lastPageParam + 1;
        },
        getPreviousPageParam: (firstPage, _allPages, firstPageParam) => {
          const currentPage = firstPage && firstPage?.data?.meta?.currentPage;
          if (currentPage === 1) return undefined;
          return firstPageParam - 1;
        },
      },
      query({ queryArg, pageParam }) {
        const queryObj = {
          ...queryArg,
          page: pageParam,
        } as GetUsersRequest;
        return USER_CONTROLLER.GET_USERS + objToQuery(queryObj);
      },
      // serializeQueryArgs: ({ queryArgs }) => ({
      //   search: queryArgs.search,
      // }),
    }),
  }),
});

export const { useGetUserByIdQuery, useGetUsersInfiniteQuery } = userApi;
