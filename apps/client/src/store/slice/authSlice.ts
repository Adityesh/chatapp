import {
  AuthSliceInitialState,
  SetAuthStateAction,
} from "@/types/authSlice.types";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

const initialState: AuthSliceInitialState = {
  isLoggedIn: false,
  user: {},
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    SET_AUTH_STATE: (
      state,
      { payload: { key, value } }: PayloadAction<SetAuthStateAction>,
    ) => {
      state[key] = value;
    },
  },
});

export const { SET_AUTH_STATE } = authSlice.actions;

export default authSlice.reducer;
