import { INestApplicationContext } from '@nestjs/common';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { Server, ServerOptions, Socket } from 'socket.io';
import type { NextFunction, RequestHandler } from 'express';
import * as passport from 'passport';

export class SocketAdapter extends IoAdapter {
  private session: RequestHandler;

  constructor(app: INestApplicationContext, session: RequestHandler) {
    super(app);
    this.session = session;
  }

  create(port: number, options?: ServerOptions): Server {
    const server: Server = super.createIOServer(port, options);

    const wrap = (middleware) => (socket: Socket, next: NextFunction) =>
      middleware(socket.request, {}, next);
    server.use(wrap(this.session));
    server.use(wrap(passport.initialize()));
    server.use(wrap(passport.session()));
    return server;
  }
}
