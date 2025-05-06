import { BaseMessageDto } from "../dto";
import { UserStatus } from '../enums';

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

export type UpdateUserStatusEvent = {
  status: UserStatus;
}

export type BroadcastMessageToChannelEvent = {
  channelId: number;
  message?: BaseMessageDto;
  actionType?: BroadCastMessageAction;
  messageId?: number;
};

export type BroadcastUserPresenceEvent = {
  userId: number;
  lastSeen: Date;
  userChannels: number[];
  status?: UserStatus;
}
