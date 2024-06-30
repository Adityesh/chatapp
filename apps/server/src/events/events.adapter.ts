import { INestApplicationContext } from '@nestjs/common';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { Server, ServerOptions } from 'socket.io';
import type { RequestHandler } from 'express';
import * as passport from 'passport';

export class EventsAdapter extends IoAdapter {
  private session: RequestHandler;
  constructor(app: INestApplicationContext, session: RequestHandler) {
    super(app);
    this.session = session;
  }

  create(port: number, options?: ServerOptions): Server {
    const server: Server = super.createIOServer(port, options);

    const wrap = (middleware) => (socket, next) =>
      middleware(socket.request, {}, next);

    server.use((socket, next) => {
      socket.data.username = 'test'; //passing random property to see if use method is working
      next();
    });
    server.use(wrap(this.session));
    server.use(wrap(passport.initialize()));
    server.use(wrap(passport.session()));
    return server;
  }
}
