import { baseApi } from "@/store/api/baseApi.ts";
import { CHANNEL_CONTROLLER } from "@/constants/url.constants.ts";
import { GetChannelsRequest, GetChannelsResponse } from "shared";
import {
  generatePaginationFilterObj,
  getInfiniteQueryOptions,
  objToQuery,
} from "@/utils";

const channelApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getChannels: builder.infiniteQuery<
      GetChannelsResponse,
      GetChannelsRequest,
      number
    >({
      infiniteQueryOptions: getInfiniteQueryOptions<GetChannelsResponse>(),
      query({ queryArg: { filter, ...rest }, pageParam }) {
        const queryObj = {
          ...rest,
          page: pageParam,
        } as GetChannelsRequest;
        return (
          CHANNEL_CONTROLLER.GET_CHANNELS +
          objToQuery({ ...queryObj, ...generatePaginationFilterObj(filter) })
        );
      },
    }),
  }),
});

export const { useGetChannelsInfiniteQuery } = channelApi;