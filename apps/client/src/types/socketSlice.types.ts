import { UserStatus } from "shared";

export interface SocketSliceState {
  channels: number[];
  usersTyping: Record<number, number[]>;
  userStatus: UserStatus;
  typing: boolean;
}
