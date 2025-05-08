import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  BroadcastUserTypingEvent,
  JoinChannelEvent,
  LeaveChannelEvent,
  SocketEvents,
  UpdateUserStatusEvent,
  UserTypingEvent,
} from "shared";
import { SocketSliceState } from "@/types/socketSlice.types.ts";
import { channelApi } from "@/store/api/channelApi.ts";
import SocketSingleton from "@/utils/socket.ts";

const initialState: SocketSliceState = {
  channels: [],
  usersTyping: {},
  userStatus: "online",
  typing: false,
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
    UPDATE_USER_TYPING: (
      state,
      {
        payload: { userId, channelId, type },
      }: PayloadAction<BroadcastUserTypingEvent>,
    ) => {
      const channelUsers = state.usersTyping[channelId];
      switch (type) {
        case "start":
          if (!channelUsers) {
            state.usersTyping[channelId] = [userId];
            return;
          }
          if (channelUsers.indexOf(userId) === -1) {
            channelUsers.push(userId);
            return;
          }
          break;
        case "stop":
          channelUsers.splice(channelUsers.indexOf(userId), 1);
          break;
      }
    },
    BROADCAST_USER_TYPING: (
      state,
      { payload: { type } }: PayloadAction<UserTypingEvent>,
    ) => {
      state.typing = type === "start";
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

export const {
  JOIN_CHANNEL,
  INIT_SOCKET,
  UPDATE_USER_STATUS,
  UPDATE_USER_TYPING,
  BROADCAST_USER_TYPING,
} = socketSlice.actions;

export default socketSlice.reducer;
