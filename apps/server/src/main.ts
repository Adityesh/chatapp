import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import * as connectPgSimple from 'connect-pg-simple';
import * as session from 'express-session';
import * as passport from 'passport';
import * as pg from 'pg';
import { AppModule } from './app.module';
import { SocketAdapter } from './socket/socket.adapter';
import { HttpExceptionFilter } from './common/filters/httpexception.filter';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import configuration from './configuration/configuration';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

const validatedEnv = configuration();
const pgStore = connectPgSimple(session);

const pgPool = new pg.Pool({
  connectionString: validatedEnv.DB_CONNECTION_STRING,
  database: 'postgres',
});

const sessionMiddleware = session({
  store: new pgStore({
    pool: pgPool,
    tableName: 'user_sessions',
    createTableIfMissing: true,
    conString: validatedEnv.DB_CONNECTION_STRING,
    schemaName: validatedEnv.DB_SCHEMA,
  }),
  secret: validatedEnv.SESSION_SECRET,
  resave: false,
  cookie: { maxAge: Number(validatedEnv.COOKIE_MAXAGE) },
  saveUninitialized: false,
});

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );
  app.useGlobalInterceptors(new ResponseInterceptor());
  app.enableCors({
    origin: validatedEnv.CLIENT_ORIGIN,
    credentials: true,
    methods: ['POST', 'PATCH', 'GET', 'HEAD', 'DELETE'],
  });
  app.setGlobalPrefix('api');
  app.use(sessionMiddleware);
  app.use(passport.initialize());
  app.use(passport.session());
  app.useWebSocketAdapter(new SocketAdapter(app, sessionMiddleware));

  const config = new DocumentBuilder()
    .setTitle('ChatApp')
    .setDescription('The ChatApp API description')
    .setVersion('0.1')
    .addTag('Chat App')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, documentFactory);

  await app.listen(3000);
}

bootstrap();
