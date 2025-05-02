import { BaseMessageDto } from "../dto";

const BroadCastMessageType = {
  DELETE: "delete",
  EDIT: "edit",
} as const;

export type BroadCastMessageAction = typeof BroadCastMessageType[keyof typeof BroadCastMessageType];

export type JoinChannelEvent = {
  channelIds: number[];
};

export type LeaveChannelEvent = {
  channelId: number;
};

export type BroadcastMessageToChannelEvent = {
  channelId: number;
  message?: BaseMessageDto;
  actionType?: BroadCastMessageAction;
  messageId?: number;
};
