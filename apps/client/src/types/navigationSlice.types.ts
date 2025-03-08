import {ObjectValue} from "@/types/utilt.types.ts";

export const TAB_TYPE = {
    CHATS : 'CHATS',
    CHANNELS : 'CHANNELS',
    USERS : 'USERS',
    NOTIFICATIONS : 'NOTIFICATIONS',
} as const;

export type TabValues = ObjectValue<typeof TAB_TYPE>

export type NavigationSliceInitialState = {
    tab: TabValues;
    tabSearch : string;
}

