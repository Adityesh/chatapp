import { Injectable } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import {
  BaseMessageDto,
  BroadCastMessageAction,
  BroadcastMessageToChannelEvent,
  BroadcastUserPresenceEvent,
  SocketEvents,
  UpdateUserDto,
  UserStatus,
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
    this.broadcastUserPresence(socket.request.user.id, new Date(), 'online');
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
    this.broadcastUserPresence(socket.request.user.id, new Date(), 'disconnected');
  }

  joinChannel(channelIds: number[], socket: Socket) {
    const userId: number = socket.request.user?.id;
    const socketId = socket.id;
    channelIds.forEach((channelId) => {
      const channelUsers = this.channelUserMap.get(channelId) || [];
      const channelUserItem = channelUsers.find((obj) => obj.userId === userId);
      if (!channelUserItem) {
        this.channelUserMap.set(
          channelId,
          channelUsers.concat({ socketId, userId } as SocketChannelObj),
        );
      }
    });
    socket.join(channelIds.map(String));
    this.broadcastUserPresence(userId, new Date(), 'online');
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
    this.broadcastUserPresence(currentUserId, new Date(), 'online');
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

  broadcastUserPresence(userId: number, lastSeen: Date, status?: UserStatus) {
    // get all the channels where user id present
    const usersToBroadcast: string[] = [];
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
        const channelMembers = value
          .filter((ob) => ob.userId !== userId)
          .map((s) => s.socketId);
        usersToBroadcast.push(...channelMembers);
      }
    });

    this.server
      .to(usersToBroadcast)
      .emit(SocketEvents.BROADCAST_USER_PRESENCE, {
        userId,
        lastSeen,
        userChannels,
        status,
      } as BroadcastUserPresenceEvent);
  }
}
