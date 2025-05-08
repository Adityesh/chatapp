import { BaseMessageDto } from "../dto";
import { UserStatus } from "../enums";

const BroadCastMessageType = {
  DELETE: "delete",
  EDIT: "edit",
} as const;

export type BroadCastMessageAction =
  (typeof BroadCastMessageType)[keyof typeof BroadCastMessageType];

export type JoinChannelEvent = {
  channelIds: number[];
};

export type LeaveChannelEvent = {
  channelId: number;
};

export type UpdateUserStatusEvent = {
  status: UserStatus;
};

const UserTypingMessageType = {
  START: "start",
  STOP: "stop",
} as const;

export type UserTypingEvent = {
  channelId: number;
  type: typeof UserTypingMessageType[keyof typeof UserTypingMessageType];
}

export type BroadcastUserTypingEvent = UserTypingEvent & {
  userId: number;
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
};
