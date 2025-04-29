import { baseApi } from "@/store/api/baseApi.ts";
import {
  LoginUserRequest,
  LoginUserResponse,
  RegisterUserRequest,
  RegisterUserResponse,
} from "shared";
import { AUTH_CONTROLLER, HTTP_METHODS } from "@/constants/url.constants.ts";
import { convertObjectToFormData } from "@/utils";

const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    loginUser: builder.mutation<LoginUserResponse, LoginUserRequest>({
      query: (body) => ({
        url: AUTH_CONTROLLER.LOGIN_LOCAL,
        body,
        method: HTTP_METHODS.POST,
      }),
    }),
    registerUser: builder.mutation<RegisterUserResponse, RegisterUserRequest>({
      query: ({ avatar, ...payload }) => {
        const formData = convertObjectToFormData(payload);
        if (avatar) {
          formData.append("avatar", avatar);
        }
        return {
          url: AUTH_CONTROLLER.REGISTER_LOCAL,
          body: formData,
          method: HTTP_METHODS.POST,
        };
      },
    }),
    logoutUser: builder.mutation<void, void>({
      query: () => ({
        url: AUTH_CONTROLLER.LOGOUT,
        method: HTTP_METHODS.POST,
      }),
    }),
  }),
});

export const {
  useLoginUserMutation,
  useRegisterUserMutation,
  useLogoutUserMutation,
} = authApi;
