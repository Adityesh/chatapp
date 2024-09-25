import {
  AUTH_CONTROLLER,
  CHAT_CONTROLLER,
  CONNECTIONS_CONTROLLER,
  HTTP_METHODS,
  USER_CONTROLLER,
} from "@/constants/url.constants";
import {
  ConnectionInviteRequest,
  ConnectionInviteResponse,
  CreateChannelRequest,
  CreateChannelResponse,
  GetChannelsRequest,
  GetChannelsResponse,
  GetChatDetailsRequest,
  GetChatDetailsResponse,
  GetConnectionsRequest,
  GetConnectionsResponse,
  GetConnectionWithUserRequest,
  GetConnectionWithUserResponse,
  GetLoggedInUserRequest,
  GetLoggedInUserResponse,
  GetMessagesRequest,
  GetMessagesResponse,
  GetUserRequest,
  GetUserResponse,
  InitateChatRequest,
  InitateChatResponse,
  LoginUserRequest,
  LoginUserResponse,
  LogoutUserRequest,
  LogoutUserResponse,
  RegisterUserRequest,
  RegisterUserResponse,
  SearchUsersRequest,
  SearchUsersResponse,
  SendMessageRequest,
  SendMessageResponse,
  UpdateConnectionInviteRequest,
  UpdateConnectionInviteResponse,
} from "@repo/shared";
import { convertObjectToFormData, objToQuery } from "@/utils";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const BASE_URL = import.meta.env.VITE_SERVER_BASE_URL;

export const baseApi = createApi({
  reducerPath: "baseApi",
  baseQuery: fetchBaseQuery({ baseUrl: BASE_URL, credentials: "include" }),
  tagTypes: [
    "loginUser",
    "registerUser",
    "logoutUser",
    "searchUsers",
    "getUser",
    "getLoggedInUser",
    "sendConnectionInvite",
    "updateConnectionInvite",
    "getConnectionWithUser",
    "initateChat",
    "getChatDetails",
    "sendMessage",
    "getMessages",
    "getChannels",
    "getConnections",
  ],
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
      query: ({ avatarUrl, ...payload }) => {
        const formData = convertObjectToFormData(payload);
        if (avatarUrl) {
          formData.append("avatarUrl", avatarUrl);
        }
        return {
          url: AUTH_CONTROLLER.REGISTER_LOCAL,
          body: formData,
          method: HTTP_METHODS.POST,
        };
      },
    }),
    logoutUser: builder.mutation<LogoutUserResponse, LogoutUserRequest>({
      query: () => ({
        url: AUTH_CONTROLLER.LOGOUT,
        method: HTTP_METHODS.POST,
      }),
    }),

    // USER CONTROLLER
    searchUsers: builder.query<SearchUsersResponse, SearchUsersRequest>({
      query: (query) => ({
        url: USER_CONTROLLER.SEARCH_USERS + objToQuery(query),
      }),
      providesTags: ["searchUsers"],
    }),
    getUser: builder.query<GetUserResponse, GetUserRequest>({
      query: ({ userId }) => ({
        url: USER_CONTROLLER.GET_USER + "/" + userId,
      }),
      providesTags: ["getUser"],
    }),
    getLoggedInUser: builder.query<
      GetLoggedInUserResponse,
      GetLoggedInUserRequest
    >({
      query: () => ({
        url: USER_CONTROLLER.GET_USER,
      }),
      providesTags: ["getLoggedInUser"],
    }),
    sendConnectionInvite: builder.mutation<
      ConnectionInviteResponse,
      ConnectionInviteRequest
    >({
      query: (body) => ({
        url: USER_CONTROLLER.CONNECTION_INVITE,
        method: HTTP_METHODS.POST,
        body,
      }),
      invalidatesTags: ["getLoggedInUser", "getConnectionWithUser"],
    }),
    updateConnectionInvite: builder.mutation<
      UpdateConnectionInviteResponse,
      UpdateConnectionInviteRequest
    >({
      query: (body) => ({
        url: USER_CONTROLLER.CONNECTION_INVITE,
        method: HTTP_METHODS.PATCH,
        body,
      }),
      invalidatesTags: ["getConnectionWithUser"],
    }),
    getConnectionWithUser: builder.query<
      GetConnectionWithUserResponse,
      GetConnectionWithUserRequest
    >({
      query: ({ userId }) => ({
        url: USER_CONTROLLER.GET_CONNECTION_WITH_USER + userId,
      }),
      providesTags: ["getConnectionWithUser"],
    }),

    // CHAT Controller
    initateChat: builder.mutation<InitateChatResponse, InitateChatRequest>({
      query: (body) => ({
        url: CHAT_CONTROLLER.INITATE_CHAT,
        method: HTTP_METHODS.POST,
        body,
      }),
    }),
    getChatDetails: builder.query<
      GetChatDetailsResponse,
      GetChatDetailsRequest
    >({
      query: ({ channelId }) => ({
        url: CHAT_CONTROLLER.CHAT_DETAILS + "/" + channelId,
      }),
      providesTags: ["getChatDetails"],
    }),
    sendMessage: builder.mutation<SendMessageResponse, SendMessageRequest>({
      query: ({ channelId, files, ...body }) => {
        const formData = convertObjectToFormData(body);
        if (files) {
          (files as File[]).forEach((file) => {
            formData.append("files", file);
          });
        }
        return {
          url: CHAT_CONTROLLER.MESSAGE + channelId,
          method: HTTP_METHODS.POST,
          body: formData,
        };
      },
      async onQueryStarted(
        { channelId },
        { dispatch, queryFulfilled, getState }
      ) {
        const { data: updatedMessage } = await queryFulfilled;
        const params = baseApi.util.selectCachedArgsForQuery(
          getState(),
          "getMessages"
        );
        const selectParams = params.find((p) => p.channelId === channelId);
        if (!selectParams) return;
        dispatch(
          baseApi.util.updateQueryData("getMessages", selectParams, (draft) => {
            if (updatedMessage && updatedMessage.data) {
              draft.data?.items.unshift(updatedMessage.data);
            }
          })
        );
      },
    }),
    getMessages: builder.query<GetMessagesResponse, GetMessagesRequest>({
      query: ({ channelId, limit = 5, page = 1 }) => ({
        url: CHAT_CONTROLLER.MESSAGE + channelId + objToQuery({ limit, page }),
      }),
      providesTags: ["getMessages"],
      serializeQueryArgs: ({ queryArgs }) => {
        return queryArgs.channelId;
      },
      merge(currentCacheData, responseData) {
        if (!responseData.data || !currentCacheData.data) return;
        const newItems = responseData.data.items;
        currentCacheData.data.meta = responseData.data.meta;
        currentCacheData.data?.items.push(...newItems);
      },
      // Refetch when the page arg changes
      forceRefetch({ currentArg, previousArg }) {
        return currentArg !== previousArg;
      },
    }),
    getChannels: builder.query<GetChannelsResponse, GetChannelsRequest>({
      query: (payload) => ({
        url: CHAT_CONTROLLER.CHANNELS + objToQuery(payload),
      }),
      providesTags: ["getChannels"],
      // serializeQueryArgs: ({ endpointName }) => {
      //   return endpointName;
      // },
      // merge(currentCacheData, responseData) {
      //   if (!responseData.data) return;
      //   const newItems = responseData.data.items;
      //   currentCacheData.data?.items.unshift(...newItems);
      // },
      // // Refetch when the page arg changes
      // forceRefetch({ currentArg, previousArg }) {
      //   return currentArg !== previousArg;
      // }
    }),
    getConnections: builder.query<
      GetConnectionsResponse,
      GetConnectionsRequest
    >({
      query: (payload) => ({
        url: CONNECTIONS_CONTROLLER.GET_CONNECTIONS + objToQuery(payload),
      }),
      providesTags: ["getConnections"],
    }),

    createChannel : builder.mutation<CreateChannelResponse, CreateChannelRequest>({
      query : (payload) => {
        const formData = convertObjectToFormData(payload)
        return {
          url : CHAT_CONTROLLER.CREATE_CHANNEL,
          method : HTTP_METHODS.POST,
          body : formData,
        }
      }
    })
  }),
});

export const {
  useLoginUserMutation,
  useRegisterUserMutation,
  useLazySearchUsersQuery,
  useSearchUsersQuery,
  useLogoutUserMutation,
  useGetUserQuery,
  useGetLoggedInUserQuery,
  useSendConnectionInviteMutation,
  useUpdateConnectionInviteMutation,
  useGetConnectionWithUserQuery,
  useInitateChatMutation,
  useGetChatDetailsQuery,
  useSendMessageMutation,
  useGetMessagesQuery,
  useGetChannelsQuery,
  useGetConnectionsQuery,
  useCreateChannelMutation
} = baseApi;
