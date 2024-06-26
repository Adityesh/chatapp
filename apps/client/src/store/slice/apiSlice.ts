import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { AUTH_API, HTTP_METHODS } from "@/constants/url.constants";
import {
  LoginUserRequest,
  LoginUserResponse,
  RegisterUserRequest,
  RegisterUserResponse,
} from "@/types/baseApi.types";

const BASE_URL = import.meta.env.VITE_SERVER_BASE_URL;

export const baseApi = createApi({
  reducerPath: "baseApi",
  baseQuery: fetchBaseQuery({ baseUrl: BASE_URL, credentials: "include" }),
  endpoints: (builder) => ({
    loginUser: builder.mutation<LoginUserResponse, LoginUserRequest>({
      query: (body) => ({
        url: AUTH_API.LOGIN_LOCAL,
        body,
        method: HTTP_METHODS.POST,
      }),
    }),
    registerUser: builder.mutation<RegisterUserResponse, RegisterUserRequest>({
      query: (body) => ({
        url: AUTH_API.REGISTER_LOCAL,
        body,
        method: HTTP_METHODS.POST,
      }),
    }),
  }),
});

export const { useLoginUserMutation, useRegisterUserMutation } = baseApi;
