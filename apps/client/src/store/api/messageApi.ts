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

const messageApi = baseApi.injectEndpoints({
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
        const newMessage = messageResponse.data;
        const params = messageApi.util.selectCachedArgsForQuery(
          getState(),
          "getAllMessages",
        );
        const cacheKey = params.find((s) => s.channelId === channelId);
        if (!cacheKey) return;

        dispatch(
          messageApi.util.updateQueryData(
            "getAllMessages",
            cacheKey,
            (draft) => {
              const lastPage = draft.pages.at(-1);
              if (lastPage) {
                lastPage.data.data.push(newMessage);
              }
            },
          ),
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
        { messageId, content },
        { dispatch, queryFulfilled, getState },
      ) {
        const { data: editMessageResponse } = await queryFulfilled;
        const editSuccess = editMessageResponse.data;
        const params = messageApi.util.selectCachedArgsForQuery(
          getState(),
          "getAllMessages",
        );
        const cacheKey = params.find(
          (s) => s.channelId === editSuccess.channel.id,
        );
        if (!cacheKey) return;
        dispatch(
          messageApi.util.updateQueryData(
            "getAllMessages",
            cacheKey,
            (draft) => {
              if (!editSuccess) return;
              const allMessages = draft.pages.flatMap((p) => p.data.data);
              allMessages.forEach((message) => {
                if (message.id === messageId) {
                  message.content = content;
                }
              });
            },
          ),
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
        const params = messageApi.util.selectCachedArgsForQuery(
          getState(),
          "getAllMessages",
        );
        const cacheKey = params.find(
          (s) => s.channelId === channelId,
        );
        if (!cacheKey) return;
        dispatch(
          messageApi.util.updateQueryData(
            "getAllMessages",
            cacheKey,
            (draft) => {
              if (!deleteSuccess) return;
              draft.pages.forEach((page) => {
                const messages = page.data.data;
                const deleteIndex = messages.findIndex(m => m.id === messageId);
                if (deleteIndex >= 0) {
                  messages.splice(deleteIndex, 1);
                }
              })
            },
          ),
        );
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
