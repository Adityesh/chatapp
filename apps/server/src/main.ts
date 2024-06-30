import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import * as connectPgSimple from 'connect-pg-simple';
import * as session from 'express-session';
import * as passport from 'passport';
import * as pg from 'pg';
import { AppModule } from './app.module';
import { EventsAdapter } from './events/events.adapter';
import { HttpExceptionFilter } from './utils/http-exception.filter';
import { ResponseInterceptor } from './utils/reponse-mapping';

const pgStore = connectPgSimple(session);

const pgPool = new pg.Pool({
  connectionString: process.env.DB_CONNECTION_STRING,
  database: 'postgres',
});

const sessionMiddleware = session({
  store: new pgStore({
    pool: pgPool,
    tableName: 'user_sessions',
    createTableIfMissing: true,
    conString: process.env.DB_CONNECTION_STRING,
    schemaName: process.env.DB_SCHEMA,
  }),
  secret: process.env.SESSION_SECRET,
  resave: false,
  cookie: { maxAge: Number(process.env.COOKIE_MAXAGE) },
  saveUninitialized: false,
});

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalInterceptors(new ResponseInterceptor());
  app.enableCors({
    origin: process.env.CLIENT_ORIGIN,
    credentials: true,
    methods: ['POST', 'PATCH', 'GET', 'HEAD', 'DELETE'],
  });
  app.setGlobalPrefix('api');
  app.use(sessionMiddleware);
  app.use(passport.initialize());
  app.use(passport.session());
  app.useWebSocketAdapter(new EventsAdapter(app, sessionMiddleware));
  await app.listen(3000);
}
bootstrap();
