import { Injectable } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import {
  BaseMessageDto,
  BroadCastMessageAction,
  BroadcastMessageToChannelEvent,
  BroadcastUserPresenceEvent,
  BroadcastUserTypingEvent,
  JoinChannelEvent,
  SocketEvents,
  UpdateUserDto,
  UpdateUserStatusEvent,
  UserTypingEvent,
} from 'shared';
import { UserService } from '../user/user.service';

interface SocketUserObj {
  socketId: string;
  sessionId: string;
  userId: number;
  lastSeen: Date;
}

interface SocketChannelObj {
  userId: number;
  socketId: string;
  isTyping: boolean;
}

@Injectable()
export class SocketService {
  public server: Server = null;
  public users: Map<number, SocketUserObj[]> = new Map();
  public channelUserMap: Map<number, SocketChannelObj[]> = new Map();

  constructor(private readonly userService: UserService) {}

  userConnection(socket: Socket) {
    if (!socket.request?.user) return;
    const socketIds = this.users.get(socket.request.user.id);
    const socketUserObj: SocketUserObj = {
      socketId: socket.id,
      sessionId: socket.request.sessionID,
      userId: socket.request.user.id,
      lastSeen: new Date(),
    };
    this.users.set(
      socket.request.user.id,
      !socketIds ? [socketUserObj] : [...socketIds, socketUserObj],
    );
    this.broadcastUserPresence(socket.request.user.id, { status: 'online' });
  }

  async userDisconnection(socket: Socket) {
    const socketIds = this.users.get(socket.request.user.id);
    await this.userService.updateUser(socket.request.user.id, {
      lastSeen: new Date(),
    } as UpdateUserDto);
    if (socketIds.length === 1) {
      this.users.delete(socket.request.user.id);
    }
    this.users.set(
      socket.request.user.id,
      socketIds.filter((id) => id.socketId !== socket.id),
    );

    const userChannelIds = this.getChannelIdForUser(socket.request.user.id);
    userChannelIds.forEach((key) => {
      const value = this.channelUserMap.get(key);
      this.channelUserMap.set(
        key,
        value.filter((obj) => obj.userId !== socket.request.user.id),
      );
      this.leaveChannel(key, socket);
      this.broadcastUserTyping({ channelId: key, type: 'stop' }, socket, true);
    });

    this.broadcastUserPresence(socket.request.user.id, {
      status: 'disconnected',
    });
  }

  joinChannel({ channelIds }: JoinChannelEvent, socket: Socket) {
    const userId: number = socket.request.user?.id;
    const socketId = socket.id;
    channelIds.forEach((channelId) => {
      const channelUsers = this.channelUserMap.get(channelId) || [];
      const channelUserItem = channelUsers.find((obj) => obj.userId === userId);
      if (!channelUserItem) {
        this.channelUserMap.set(
          channelId,
          channelUsers.concat({
            socketId,
            userId,
            isTyping: false,
          } as SocketChannelObj),
        );
      }
    });
    socket.join(channelIds.map(String));
    this.broadcastUserPresence(userId, { status: 'online' });
  }

  leaveChannel(channelId: number, socket: Socket) {
    const channelUsers = this.channelUserMap.get(channelId);
    this.channelUserMap.set(
      channelId,
      channelUsers.filter((cu) => cu.socketId !== socket.id),
    );
    socket.leave(channelId.toString());
  }

  broadcastMessage(
    channelId: number,
    currentUserId: number,
    currentUserSessionId: string,
    message?: BaseMessageDto,
    actionType?: BroadCastMessageAction,
    messageId?: number,
  ) {
    const currentUserObj = this.users
      .get(currentUserId)
      .find((s) => s.sessionId === currentUserSessionId);
    this.broadcastUserPresence(currentUserId, { status: 'online' });
    this.server
      .in(channelId.toString())
      .except(currentUserObj.socketId)
      .emit(SocketEvents.BROADCAST_MESSAGE_TO_CHANNEL, {
        message,
        channelId,
        actionType,
        messageId,
      } as BroadcastMessageToChannelEvent);
  }

  broadcastUserPresence(userId: number, { status }: UpdateUserStatusEvent) {
    const lastSeen = new Date();
    // get all the channels where user id present
    const userChannels: number[] = [];
    const socketUserObj = this.users.get(userId);
    if (socketUserObj) {
      this.users.set(
        userId,
        socketUserObj.map((obj) => ({
          ...obj,
          lastSeen,
        })),
      );
    }
    this.channelUserMap.forEach((value, key) => {
      const isUserInChannel = value.find((obj) => obj.userId === userId);
      if (isUserInChannel) {
        userChannels.push(key);
      }
    });

    this.server
      .to(userChannels.map(String))
      .except(socketUserObj.find((obj) => obj.userId === userId)?.socketId)
      .emit(SocketEvents.BROADCAST_USER_PRESENCE, {
        userId,
        lastSeen,
        userChannels,
        status,
      } as BroadcastUserPresenceEvent);
  }

  getChannelIdForUser(userId: number) {
    const channelIds: number[] = [];
    this.channelUserMap.forEach((value, key) => {
      const isUserPresent = value.findIndex((obj) => obj.userId === userId);
      if (isUserPresent > 0) {
        channelIds.push(key);
      }
    });
    return channelIds;
  }

  broadcastUserTyping(
    { channelId, type }: UserTypingEvent,
    socket: Socket,
    isDisconnecting?: boolean,
  ) {
    const userId: number = socket.request.user.id;
    const isUpdated = this.updateChannelUserObj(channelId, userId, {
      isTyping: type === 'start',
    });
    if (isUpdated || isDisconnecting) {
      this.server
        .in(channelId.toString())
        .except(socket.id)
        .emit(SocketEvents.BROADCAST_USER_TYPING, {
          type,
          channelId,
          userId,
        } as BroadcastUserTypingEvent);
    }
  }

  updateChannelUserObj(
    channelId: number,
    userId: number,
    updateObj: Partial<SocketChannelObj>,
  ): boolean {
    const channelUserValue = this.channelUserMap.get(channelId);
    if (!channelUserValue) return false;
    const userObjIndex = channelUserValue.findIndex(
      (obj) => obj.userId === userId,
    );
    if (userObjIndex === -1) return false;
    channelUserValue[userObjIndex] = {
      ...channelUserValue[userObjIndex],
      ...updateObj,
    };
    this.channelUserMap.set(channelId, channelUserValue);
    return true;
  }
}
