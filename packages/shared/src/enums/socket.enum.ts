export enum SocketEvents {
  CONNECT = "connect",
  DISCONNECT = "disconnect",
  JOIN_CHANNEL = "join-channel",
  LEAVE_CHANNEL = "leave-channel",
  ERROR = "error",
  SEND_MESSAGE = "send-message",
  RECEIVE_MESSAGE = "receive-message",
  USER_JOINED_CHANNEL = "user-joined-channel",
  USER_LEFT_CHANNEL = "user-left-channel",
  USER_TYPING = "user-typing",
}
