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
    this.socketService.socket = server;
  }

  handleDisconnect() {
    console.log('Client disconnected');
  }
  handleConnection() {
    console.log('Client connected');
  }
}
