export interface SocketSliceState {
  channels: number[];
  usersTyping: Record<string, string[]>;
}
