import {
  NavigationSliceInitialState,
  SetNavigationStateAction,
} from "@/types/navigationSlice.types";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

const initialState: NavigationSliceInitialState = {
  tab: "chat",
};

const navigationSlice = createSlice({
  name: "navigation",
  initialState,
  reducers: {
    SET_NAVIGATION_STATE: (
      state,
      { payload: { key, value } }: PayloadAction<SetNavigationStateAction>,
    ) => {
      state[key] = value;
    },
  },
});

export const { SET_NAVIGATION_STATE } = navigationSlice.actions;

export default navigationSlice.reducer;
