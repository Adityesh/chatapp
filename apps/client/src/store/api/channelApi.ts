import { baseApi } from "@/store/api/baseApi.ts";
import { CHANNEL_CONTROLLER } from "@/constants/url.constants.ts";
import {
  GetChannelRequest,
  GetChannelResponse,
  GetChannelsRequest,
  GetChannelsResponse,
} from "shared";
import {
  generatePaginationFilterObj,
  getInfiniteQueryOptions,
  objToQuery,
} from "@/utils";

export const channelApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getChannels: builder.infiniteQuery<
      GetChannelsResponse,
      GetChannelsRequest,
      number
    >({
      infiniteQueryOptions: getInfiniteQueryOptions<GetChannelsResponse>(),
      query({ queryArg: { filter, currentUser, ...rest }, pageParam }) {
        const queryObj = {
          ...rest,
          page: pageParam,
        } as GetChannelsRequest;
        return (
          (currentUser
            ? CHANNEL_CONTROLLER.GET_CHANNELS_FOR_CURRENT_USER
            : CHANNEL_CONTROLLER.GET_CHANNELS) +
          objToQuery({ ...queryObj, ...generatePaginationFilterObj(filter) })
        );
      },
    }),
    getChannelById: builder.query<GetChannelResponse, GetChannelRequest>({
      query: ({ id }) => ({
        url: CHANNEL_CONTROLLER.GET_CHANNEL_BY_ID.replace(
          "{channelId}",
          id!.toString(),
        ),
      }),
    }),
  }),
});

export const { useGetChannelsInfiniteQuery, useGetChannelByIdQuery } =
  channelApi;
