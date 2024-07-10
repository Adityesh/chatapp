import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import {
  MarkMessageAsReadEvent,
  MarkMessageAsReadEventReturn,
  SocketEvents,
  UserTypingEvent,
} from '@repo/shared';
import 'dotenv/config';
import { Server, Socket } from 'socket.io';
import { ChatService } from 'src/chat/chat.service';
import { SocketService } from 'src/socket/socket.service';

@WebSocketGateway({
  cors: {
    credentials: true,
    origin: process.env.CLIENT_ORIGIN,
  },
})
export class EventsGateway
  implements OnGatewayConnection, OnGatewayInit, OnGatewayDisconnect
{
  constructor(
    private socketService: SocketService,
    private readonly chatService: ChatService,
  ) {}

  @WebSocketServer()
  public server: Server;

  afterInit(server: Server) {
    this.socketService.server = server;
  }

  handleDisconnect(client: any) {
    console.log('Client disconnected');
    this.socketService.users.delete(client.id);
  }
  handleConnection(client: any) {
    this.socketService.users.set(client.id, client.request.user);
  }

  @SubscribeMessage(SocketEvents.JOIN_CHANNEL)
  async joinChannel(socket: any, channelId: string) {
    socket.join(channelId);
    this.server
      .to(channelId)
      .emit(
        SocketEvents.USER_JOINED_CHANNEL,
        `User ${socket.request.user.fullName} has joined channel ${channelId}`,
      );
  }

  @SubscribeMessage(SocketEvents.LEAVE_CHANNEL)
  async leaveChannel(socket: any, channelId: string) {
    socket.leave(channelId);
    this.server
      .to(channelId)
      .emit(
        SocketEvents.USER_LEFT_CHANNEL,
        `User ${socket.request.user.fullName} has left channel ${channelId}`,
      );
    this.server.to(channelId).emit(SocketEvents.USER_TYPING, {
      fullName: socket.request.user.fullName,
      channelId,
      typing: false,
    } as UserTypingEvent);
  }

  @SubscribeMessage(SocketEvents.SEND_MESSAGE)
  async sendMessage(socket: Socket, payload) {
    const { channelId, ...newMessage } = payload;
    socket.broadcast
      .to(channelId.toString())
      .emit(SocketEvents.RECEIVE_MESSAGE, payload);
  }

  @SubscribeMessage(SocketEvents.USER_TYPING)
  async userTyping(socket: Socket, payload: UserTypingEvent) {
    const { channelId } = payload;
    socket.broadcast.to(channelId).emit(SocketEvents.USER_TYPING, payload);
  }

  @SubscribeMessage(SocketEvents.MARK_MESSAGE_READ)
  async markMessageAsRead(
    socket: Socket,
    { channelId, messageStatusId }: MarkMessageAsReadEvent,
  ) {
    console.log(channelId, messageStatusId);
    const { readAt } =
      await this.chatService.markMessageAsRead(messageStatusId);
    const response = {
      channelId,
      messageStatusId,
      readAt: readAt.toISOString(),
    } as MarkMessageAsReadEventReturn;
    this.server
      .to(channelId.toString())
      .emit(SocketEvents.MARK_MESSAGE_READ, response);
  }
}
