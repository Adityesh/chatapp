import { createSlice, PayloadAction } from "@reduxjs/toolkit";

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
  },
});

export const {
  INIT_SOCKET,
  SOCKET_DISCONNECTED,
  SOCKET_CONNECTED,
  JOIN_CHANNEL,
  LEAVE_CHANNEL,
} = socketSlice.actions;

export default socketSlice.reducer;
