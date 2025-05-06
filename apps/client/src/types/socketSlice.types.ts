import { UserStatus } from 'shared';

export interface SocketSliceState {
  channels: number[];
  usersTyping: Record<string, string[]>;
  userStatus: UserStatus;
}
