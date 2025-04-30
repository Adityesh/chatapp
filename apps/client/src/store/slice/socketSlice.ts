import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface SocketSliceState {
  channels: string[];
  usersTyping: Record<string, string[]>;
}

const initialState: SocketSliceState = {
  channels: [],
  usersTyping: {},
};

const socketSlice = createSlice({
  name: "socket",
  initialState,
  reducers: {
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
  JOIN_CHANNEL,
  LEAVE_CHANNEL,
} = socketSlice.actions;

export default socketSlice.reducer;
