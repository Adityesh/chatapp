import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import 'dotenv/config';
import { Server, Socket } from 'socket.io';
import { SocketService } from 'src/socket/socket.service';
import configuration from '../configuration/configuration';
import { JoinChannelEvent, LeaveChannelEvent, SocketEvents } from 'shared';

const validatedEnv = configuration();

@WebSocketGateway({
  cors: {
    credentials: true,
    origin: validatedEnv.CLIENT_ORIGIN,
  },
})
export class SocketGateway
  implements OnGatewayConnection, OnGatewayInit, OnGatewayDisconnect
{
  constructor(private socketService: SocketService) {}

  @WebSocketServer()
  public server: Server;

  afterInit(server: Server) {
    this.socketService.server = server;
  }

  handleDisconnect(socket: Socket) {
    this.socketService.userDisconnection(socket);
  }

  handleConnection(socket: Socket) {
    this.socketService.userConnection(socket);
  }

  @SubscribeMessage(SocketEvents.JOIN_CHANNEL)
  joinChannelEvent(
    @MessageBody() { channelIds }: JoinChannelEvent,
    @ConnectedSocket() client: Socket,
  ) {
    this.socketService.joinChannel(channelIds, client);
  }

  @SubscribeMessage(SocketEvents.LEAVE_CHANNEL)
  leaveChannelEvent(
    @MessageBody() { channelId }: LeaveChannelEvent,
    @ConnectedSocket() socket: Socket,
  ) {
    this.socketService.leaveChannel(channelId, socket);
  }
}
