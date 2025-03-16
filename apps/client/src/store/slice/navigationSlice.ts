import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  NavigationSliceInitialState,
  SetSelectedTabItem,
  TabValues,
} from "@/types/navigationSlice.types.ts";

const initialState: NavigationSliceInitialState = {
  tab: "CHATS",
  tabSearch: "",
  selectedItem: null,
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
      state.tabSearch = payload;
    },
    SET_TAB_SELECTED_ITEM: (
      state,
      { payload: { value } }: PayloadAction<SetSelectedTabItem>,
    ) => {
      state.selectedItem = value;
    },
  },
});

export const { SET_NAVIGATION_TAB, UPDATE_TAB_SEARCH, SET_TAB_SELECTED_ITEM } =
  navigationSlice.actions;

export default navigationSlice.reducer;
