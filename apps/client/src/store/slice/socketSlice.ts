import { createSlice } from "@reduxjs/toolkit";

export interface SocketSliceState {
  isConnected: boolean;
  rooms: string[];
}

const initialState: SocketSliceState = {
  isConnected: false,
  rooms: [],
};

const socketSlice = createSlice({
  name: "socket",
  initialState,
  reducers: {
    INIT_SOCKET: () => {
      return;
    },
    SOCKET_CONNECTED: (state) => {
      state.isConnected = true;
    },
    SOCKET_DISCONNECTED: (state) => {
      state.isConnected = false;
    },
  },
});

export const { INIT_SOCKET, SOCKET_DISCONNECTED, SOCKET_CONNECTED } =
  socketSlice.actions;

export default socketSlice.reducer;
