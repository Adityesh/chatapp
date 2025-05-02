import { Injectable } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import {
  BaseMessageDto,
  BroadCastMessageAction,
  BroadcastMessageToChannelEvent,
  SocketEvents,
} from 'shared';

interface SocketUserObj {
  socketId: string;
  sessionId: string;
}

@Injectable()
export class SocketService {
  public server: Server = null;
  public users: Map<number, SocketUserObj[]> = new Map();
  public channelUsers: Map<number, number[]> = new Map();

  userConnection(socket: Socket) {
    const socketIds = this.users.get(socket.request.user.id);
    const socketUserObj: SocketUserObj = {
      socketId: socket.id,
      sessionId: socket.request.sessionID,
    };
    this.users.set(
      socket.request.user.id,
      !socketIds ? [socketUserObj] : [...socketIds, socketUserObj],
    );
  }

  userDisconnection(socket: Socket) {
    const socketIds = this.users.get(socket.request.user.id);
    if (socketIds.length === 1) {
      this.users.delete(socket.request.user.id);
    }
    this.users.set(
      socket.request.user.id,
      socketIds.filter((id) => id.socketId !== socket.id),
    );
  }

  joinChannel(channelIds: number[], socket: Socket) {
    const userId: number = socket.request.user?.id;
    channelIds.forEach((channelId) => {
      const channelUserItem = this.channelUsers.get(channelId) || [];
      if (!channelUserItem.includes(userId)) {
        this.channelUsers.set(
          channelId,
          channelUserItem
            ? [...channelUserItem, socket.request.user.id]
            : [userId],
        );
      }
    });
    socket.join(channelIds.map(String));
  }

  leaveChannel(channelId: number, socket: Socket) {
    const channelUsers = this.channelUsers.get(channelId);
    this.channelUsers.set(
      channelId,
      channelUsers.concat(socket.request.user.id),
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
}
