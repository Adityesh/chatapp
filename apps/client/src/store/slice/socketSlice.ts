import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { SendMessageResult } from "@repo/shared";

export interface SocketSliceState {
  isConnected: boolean;
  channels: string[];
}

const initialState: SocketSliceState = {
  isConnected: false,
  channels: [],
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
      { payload: { id } }: PayloadAction<{ id: string }>
    ) => {
      state.channels = state.channels.filter((i) => i !== id);
    },
    SEND_MESSAGE: (state, _payload: PayloadAction<SendMessageResult & {
      channelId : number
    }>) => {
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
} = socketSlice.actions;

export default socketSlice.reducer;
