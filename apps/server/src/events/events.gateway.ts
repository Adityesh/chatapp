import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { SocketEvents } from '@repo/shared';
import 'dotenv/config';
import { Server, Socket } from 'socket.io';
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
  constructor(private socketService: SocketService) {}

  @WebSocketServer()
  public server: Server;

  afterInit(server: Server) {
    this.socketService.server = server;
  }

  handleDisconnect(client: any) {
    console.log('Client disconnected');
    // this.socketService.users.delete(client.request.user.id);
  }
  handleConnection(client: any) {
    // const doesUserExist = this.socketService.users.get(client.request.user.id)
    // if(!doesUserExist) {
    //   this.socketService.users.set(client.request.user.id, client.id)
    // }
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
        SocketEvents.USER_JOINED_CHANNEL,
        `User ${socket.request.user.fullName} has left channel ${channelId}`,
      );
  }

  @SubscribeMessage(SocketEvents.SEND_MESSAGE)
  async sendMessage(socket: Socket, payload) {
    const { channelId, ...newMessage } = payload;
    socket.broadcast
      .to(channelId.toString())
      .emit(SocketEvents.RECEIVE_MESSAGE, payload);
  }
}
