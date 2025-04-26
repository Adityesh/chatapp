import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import 'dotenv/config';
import { Server } from 'socket.io';
import { SocketService } from 'src/socket/socket.service';
import configuration from '../configuration/configuration';

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

  handleDisconnect(client: any) {
    this.socketService.users.delete(client.id);
  }

  handleConnection(client: any) {
    this.socketService.users.set(client.id, client.request.user);
  }
}
