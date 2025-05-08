export enum SocketEvents {
  JOIN_CHANNEL = "join-channel",
  LEAVE_CHANNEL = "leave-channel",
  BROADCAST_MESSAGE_TO_CHANNEL = "broadcast-message-to-channel",
  BROADCAST_USER_PRESENCE = "broadcast-user-presence",
  BROADCAST_CURRENT_USER_STATUS = "broadcast-current_user-status",
  USER_TYPING = "user-typing",
  BROADCAST_USER_TYPING = "broadcast-user-typing",
}

export const UserStatusValues = {
  ONLINE: "online",
  DISCONNECTED: "disconnected",
  AWAY: "away",
} as const;

export type UserStatus =
  (typeof UserStatusValues)[keyof typeof UserStatusValues];
