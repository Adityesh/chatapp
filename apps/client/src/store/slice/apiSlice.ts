import {
  AUTH_CONTROLLER,
  HTTP_METHODS,
  USER_CONTROLLER,
} from "@/constants/url.constants";
import {
  LoginUserRequest,
  LoginUserResponse,
  LogoutUserRequest,
  LogoutUserResponse,
  RegisterUserRequest,
  RegisterUserResponse,
  SearchUsersRequest,
  SearchUsersResponse,
} from "@/types/baseApi.types";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const BASE_URL = import.meta.env.VITE_SERVER_BASE_URL;

export const baseApi = createApi({
  reducerPath: "baseApi",
  baseQuery: fetchBaseQuery({ baseUrl: BASE_URL, credentials: "include" }),
  endpoints: (builder) => ({
    // AUTH CONTROLLER
    loginUser: builder.mutation<LoginUserResponse, LoginUserRequest>({
      query: (body) => ({
        url: AUTH_CONTROLLER.LOGIN_LOCAL,
        body,
        method: HTTP_METHODS.POST,
      }),
    }),
    registerUser: builder.mutation<RegisterUserResponse, RegisterUserRequest>({
      query: (body) => ({
        url: AUTH_CONTROLLER.REGISTER_LOCAL,
        body,
        method: HTTP_METHODS.POST,
      }),
    }),
    logoutUser: builder.mutation<LogoutUserResponse, LogoutUserRequest>({
      query: () => ({
        url: AUTH_CONTROLLER.LOGOUT,
        method: HTTP_METHODS.POST,
      }),
    }),

    // USER CONTROLLER
    searchUsers: builder.query<SearchUsersResponse, SearchUsersRequest>({
      query: () => ({
        url: USER_CONTROLLER.SEARCH_USERS,
      }),
    }),
  }),
});

export const {
  useLoginUserMutation,
  useRegisterUserMutation,
  useLazySearchUsersQuery,
  useSearchUsersQuery,
  useLogoutUserMutation,
} = baseApi;
