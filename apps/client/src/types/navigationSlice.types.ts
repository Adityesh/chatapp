import { ObjectValue } from "@/types/util.types.ts";
import { BaseUserDto, ClassProperties } from "shared";

export const TAB_TYPE = {
  CHATS: "CHATS",
  CHANNELS: "CHANNELS",
  USERS: "USERS",
  NOTIFICATIONS: "NOTIFICATIONS",
} as const;

export type TabValues = ObjectValue<typeof TAB_TYPE>;

export type TabSelectedItemType = ClassProperties<typeof BaseUserDto> | null;

export type NavigationSliceInitialState = {
  tab: TabValues;
  tabSearch: string;
  selectedItem: TabSelectedItemType;
};

export type SetSelectedTabItem = {
  value: NavigationSliceInitialState["selectedItem"];
};
