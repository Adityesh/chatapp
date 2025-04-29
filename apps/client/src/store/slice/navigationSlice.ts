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
  usersTab: {
    searchType: "connections",
  },
};

const navigationSlice = createSlice({
  name: "navigation",
  initialState,
  reducers: {
    SET_NAVIGATION_TAB: (state, { payload }: PayloadAction<TabValues>) => {
      Object.assign(state, {
        ...state,
        tab: payload,
        tabSearch: "",
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
    SET_USERS_TAB_SEARCH_TYPE: (
      state,
      {
        payload,
      }: PayloadAction<NavigationSliceInitialState["usersTab"]["searchType"]>,
    ) => {
      state.usersTab.searchType = payload;
    },
  },
});

export const {
  SET_NAVIGATION_TAB,
  UPDATE_TAB_SEARCH,
  SET_TAB_SELECTED_ITEM,
  SET_USERS_TAB_SEARCH_TYPE,
} = navigationSlice.actions;

export default navigationSlice.reducer;
