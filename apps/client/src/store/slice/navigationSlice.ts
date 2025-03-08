import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  NavigationSliceInitialState,
  TabValues,
} from "@/types/navigationSlice.types.ts";

const initialState: NavigationSliceInitialState = {
  tab: "CHATS",
  tabSearch : ""
};

const navigationSlice = createSlice({
  name: "navigation",
  initialState,
  reducers: {
    SET_NAVIGATION_TAB: (state, { payload }: PayloadAction<TabValues>) => {
      Object.assign(state, {
        ...state,
        tab: payload,
      });
    },
    UPDATE_TAB_SEARCH: (state, { payload }: PayloadAction<string>) => {
      Object.assign(state, {
        ...state,
        tabSearch: payload,
      })
    }
  },
});

export const { SET_NAVIGATION_TAB, UPDATE_TAB_SEARCH } = navigationSlice.actions;

export default navigationSlice.reducer;
