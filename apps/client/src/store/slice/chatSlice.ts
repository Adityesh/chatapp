import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import {
  ChatSliceInitialState,
  ResetDraftAction,
  UpdateDraftAction,
} from "@/types/chatSlice.types.ts";

const initialState: ChatSliceInitialState = {
  drafts: {},
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    UPDATE_DRAFT: (state, action: PayloadAction<UpdateDraftAction>) => {
      console.log(action.payload.content);
      const channelDraft = state.drafts[action.payload.channelId];
      state.drafts[action.payload.channelId] = {
        ...channelDraft,
        ...action.payload,
      };
    },
    RESET_DRAFT: (state, action: PayloadAction<ResetDraftAction>) => {
      delete state.drafts[action.payload.channelId];
    },
  },
});

export const { UPDATE_DRAFT, RESET_DRAFT } = chatSlice.actions;

export default chatSlice.reducer;
