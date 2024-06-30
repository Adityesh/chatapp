import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import 'dotenv/config';
import { Server } from 'socket.io';

@WebSocketGateway({
  cors: {
    credentials: true,
    origin: process.env.CLIENT_ORIGIN,
  },
})
export class EventsGateway
  implements OnGatewayConnection, OnGatewayInit, OnGatewayDisconnect
{
  @WebSocketServer()
  public server: Server;

  afterInit() {}

  handleDisconnect() {
    console.log('Client disconnected');
  }
  handleConnection() {
    console.log('Client connected');
  }
}
