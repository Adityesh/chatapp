import {
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse,
} from '@nestjs/websockets';
import { Observable, from, map } from 'rxjs';
import { Server } from 'socket.io';

@WebSocketGateway()
export class EventsGateway
  implements OnGatewayConnection, OnGatewayInit, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  afterInit(server: any) {
    console.log(server);
  }
  handleDisconnect(client: any) {
    console.log(client);
  }
  handleConnection(client: any) {
    console.log(client);
  }

  @SubscribeMessage('events')
  findAll(): Observable<WsResponse<number>> {
    return from([1, 2, 3]).pipe(
      map((item) => ({ event: 'events', data: item })),
    );
  }

  @SubscribeMessage('identity')
  async identity(@MessageBody() data: number): Promise<number> {
    return data;
  }
}
