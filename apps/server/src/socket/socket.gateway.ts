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
import {
  JoinChannelEvent,
  LeaveChannelEvent,
  SocketEvents,
  UpdateUserStatusEvent,
  UserTypingEvent,
} from 'shared';

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
    @MessageBody() body: JoinChannelEvent,
    @ConnectedSocket() client: Socket,
  ) {
    this.socketService.joinChannel(body, client);
  }

  @SubscribeMessage(SocketEvents.LEAVE_CHANNEL)
  leaveChannelEvent(
    @MessageBody() { channelId }: LeaveChannelEvent,
    @ConnectedSocket() socket: Socket,
  ) {
    this.socketService.leaveChannel(channelId, socket);
  }

  @SubscribeMessage(SocketEvents.BROADCAST_CURRENT_USER_STATUS)
  broadcastUserStatus(
    @MessageBody() body: UpdateUserStatusEvent,
    @ConnectedSocket() socket: Socket,
  ) {
    this.socketService.broadcastUserPresence(socket.request.user.id, body);
  }

  @SubscribeMessage(SocketEvents.USER_TYPING)
  userTyping(
    @MessageBody() body: UserTypingEvent,
    @ConnectedSocket() socket: Socket,
  ) {
    this.socketService.broadcastUserTyping(body, socket);
  }
}
