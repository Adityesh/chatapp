import { Injectable } from '@nestjs/common';
import { Server } from 'socket.io';
import { User } from 'src/entities/user.entity';

@Injectable()
export class SocketService {
  public server: Server = null;
  public users: Map<string, Express.User> = new Map();
}
