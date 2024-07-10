import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import {
  MarkMessageAsReadEvent,
  SendMessageResult,
  UserTypingEvent,
} from "@repo/shared";

export interface SocketSliceState {
  isConnected: boolean;
  channels: string[];
  usersTyping: Record<string, string[]>;
}

const initialState: SocketSliceState = {
  isConnected: false,
  channels: [],
  usersTyping: {},
};

const socketSlice = createSlice({
  name: "socket",
  initialState,
  reducers: {
    INIT_SOCKET: (state) => {
      return state;
    },
    SOCKET_CONNECTED: (state) => {
      state.isConnected = true;
    },
    SOCKET_DISCONNECTED: (state) => {
      state.isConnected = false;
    },
    JOIN_CHANNEL: (state, data: PayloadAction<{ id: string }>) => {
      state.channels.push(data.payload.id);
    },
    LEAVE_CHANNEL: (
      state,
      { payload: { id } }: PayloadAction<{ id: string }>,
    ) => {
      state.channels = state.channels.filter((i) => i !== id);
    },
    SEND_MESSAGE: (
      state,
      _payload: PayloadAction<
        SendMessageResult & {
          channelId: number;
        }
      >,
    ) => {
      return state;
    },
    USER_TYPING: (state, _payload: PayloadAction<UserTypingEvent>) => {
      return state;
    },
    SET_USER_TYPING: (
      { usersTyping, channels },
      { payload }: PayloadAction<UserTypingEvent>,
    ) => {
      const { channelId, fullName, typing } = payload;
      if (!channels.find((c) => c === channelId)) return;
      const doesHaveChannel = usersTyping[channelId] != null;
      const userItem = usersTyping[channelId];
      if (typing) {
        if (!doesHaveChannel) {
          usersTyping[channelId] = [fullName];
          return;
        }
        if (userItem) {
          usersTyping[channelId] = [...userItem, fullName];
          return;
        }
      }
      if (userItem) {
        usersTyping[channelId] = userItem.filter((u) => u !== fullName);
      }
    },
    MARK_MESSAGE_AS_READ: (
      state,
      payload: PayloadAction<MarkMessageAsReadEvent>,
    ) => {
      return state;
    },
  },
});

export const {
  SEND_MESSAGE,
  INIT_SOCKET,
  SOCKET_DISCONNECTED,
  SOCKET_CONNECTED,
  JOIN_CHANNEL,
  LEAVE_CHANNEL,
  USER_TYPING,
  SET_USER_TYPING,
  MARK_MESSAGE_AS_READ,
} = socketSlice.actions;

export default socketSlice.reducer;
