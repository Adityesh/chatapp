import { Injectable } from '@nestjs/common';
import { Server } from 'socket.io';

@Injectable()
export class SocketService {
  public server: Server = null;
  public users: Map<string, Express.User> = new Map();
}
