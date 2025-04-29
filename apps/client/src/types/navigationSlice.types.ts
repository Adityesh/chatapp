import { ObjectValue } from "@/types/util.types.ts";
import { BaseChannelDto, BaseUserDto, ClassProperties } from "shared";

export const TAB_TYPE = {
  CHATS: "CHATS",
  CHANNELS: "CHANNELS",
  USERS: "USERS",
  NOTIFICATIONS: "NOTIFICATIONS",
} as const;

export type TabValues = ObjectValue<typeof TAB_TYPE>;

export type TabSelectedItemType =
  | ClassProperties<typeof BaseUserDto>
  | ClassProperties<typeof BaseChannelDto>
  | null;

export type NavigationSliceInitialState = {
  tab: TabValues;
  tabSearch: string;
  selectedItem: TabSelectedItemType;
  usersTab: {
    searchType: "users" | "connections";
  };
};

export type SetSelectedTabItem = {
  value: NavigationSliceInitialState["selectedItem"];
};
