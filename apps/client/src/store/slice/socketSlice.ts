import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  JoinChannelEvent,
  LeaveChannelEvent,
  SocketEvents,
  UpdateUserStatusEvent,
} from "shared";
import { SocketSliceState } from "@/types/socketSlice.types.ts";
import { channelApi } from "@/store/api/channelApi.ts";
import SocketSingleton from "@/utils/socket.ts";

const initialState: SocketSliceState = {
  channels: [],
  usersTyping: {},
  userStatus: "online",
};

const socket = SocketSingleton.getInstance();

const socketSlice = createSlice({
  name: "socket",
  initialState,
  reducers: {
    INIT_SOCKET: () => {
      return;
    },
    JOIN_CHANNEL: (state, data: PayloadAction<JoinChannelEvent>) => {
      state.channels = Array.from(
        new Set([...state.channels, ...data.payload.channelIds]),
      );
    },
    LEAVE_CHANNEL: (state, data: PayloadAction<LeaveChannelEvent>) => {
      state.channels = state.channels.filter(
        (id) => data.payload.channelId !== id,
      );
    },
    UPDATE_USER_STATUS: (state, data: PayloadAction<UpdateUserStatusEvent>) => {
      state.userStatus = data.payload.status;
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      channelApi.endpoints.getChannels.matchFulfilled,
      (state, { payload: { pages } }) => {
        const latestResponse = pages.at(-1);
        if (!latestResponse) return state;
        const newChannelJoin = latestResponse.data.data.map((c) => c.id);
        state.channels.push(...newChannelJoin);
        socket.emit(SocketEvents.JOIN_CHANNEL, {
          channelIds: newChannelJoin,
        } as JoinChannelEvent);
      },
    );
  },
});

export const { JOIN_CHANNEL, INIT_SOCKET, UPDATE_USER_STATUS } =
  socketSlice.actions;

export default socketSlice.reducer;
