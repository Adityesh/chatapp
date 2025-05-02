import { baseApi } from "@/store/api/baseApi.ts";
import { HTTP_METHODS, MESSAGE_CONTROLLER } from "@/constants/url.constants.ts";
import {
  CreateMessageRequest,
  CreateMessageResponse,
  DeleteMessageRequest,
  DeleteMessageResponse,
  EditMessageRequest,
  EditMessageResponse,
  GetMessagesRequest,
  GetMessagesResponse,
} from "shared";
import {
  generatePaginationFilterObj,
  getInfiniteQueryOptions,
  objToQuery,
} from "@/utils";
import {
  deleteMessageCache,
  editMessageCache,
  insertMessageCache,
} from "@/utils/api.ts";
import { RootState } from "@/types/store.types.ts";

export const messageApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createMessage: builder.mutation<
      CreateMessageResponse,
      CreateMessageRequest
    >({
      query: (payload) => ({
        url: MESSAGE_CONTROLLER.CREATE_MESSAGE,
        body: payload,
        method: HTTP_METHODS.POST,
      }),
      async onQueryStarted(
        { channelId },
        { dispatch, queryFulfilled, getState },
      ) {
        const { data: messageResponse } = await queryFulfilled;
        const savedMessage = messageResponse.data;
        insertMessageCache(
          savedMessage,
          channelId,
          dispatch,
          getState() as RootState,
        );
      },
    }),
    editMessage: builder.mutation<EditMessageResponse, EditMessageRequest>({
      query: (payload) => ({
        url: MESSAGE_CONTROLLER.EDIT_MESSAGE,
        body: payload,
        method: HTTP_METHODS.PATCH,
      }),
      async onQueryStarted(
        { messageId },
        { dispatch, queryFulfilled, getState },
      ) {
        const { data: editMessageResponse } = await queryFulfilled;
        const editedMessage = editMessageResponse.data;
        editMessageCache(
          editedMessage,
          messageId,
          dispatch,
          getState() as RootState,
        );
      },
    }),
    deleteMessage: builder.mutation<
      DeleteMessageResponse,
      DeleteMessageRequest
    >({
      query: (payload) => ({
        url: MESSAGE_CONTROLLER.DELETE_MESSAGE,
        body: payload,
        method: HTTP_METHODS.DELETE,
      }),
      async onQueryStarted(
        { messageId, channelId },
        { dispatch, queryFulfilled, getState },
      ) {
        const { data: deleteMessageResponse } = await queryFulfilled;
        const deleteSuccess = deleteMessageResponse.data;
        if (deleteSuccess) {
          deleteMessageCache(
            messageId,
            channelId,
            dispatch,
            getState() as RootState,
          );
        }
      },
    }),
    getAllMessages: builder.infiniteQuery<
      GetMessagesResponse,
      GetMessagesRequest,
      number
    >({
      infiniteQueryOptions: getInfiniteQueryOptions<GetMessagesResponse>(),
      query({ queryArg: { filter, channelId, ...rest }, pageParam }) {
        const queryObj = {
          ...rest,
          page: pageParam,
        } as GetMessagesRequest;
        return (
          MESSAGE_CONTROLLER.GET_MESSAGES.replace(
            "{channelId}",
            channelId.toString(),
          ) +
          objToQuery({ ...queryObj, ...generatePaginationFilterObj(filter) })
        );
      },
      providesTags: ["getMessages"],
    }),
  }),
});

export const {
  useCreateMessageMutation,
  useEditMessageMutation,
  useGetAllMessagesInfiniteQuery,
  useDeleteMessageMutation,
} = messageApi;
