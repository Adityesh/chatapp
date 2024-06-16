import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as session from 'express-session';
import * as connectPgSimple from 'connect-pg-simple';
import * as pg from 'pg';
import * as passport from 'passport';

const pgStore = connectPgSimple(session);

const pgPool = new pg.Pool({
  connectionString: process.env.DB_CONNECTION_STRING,
  database: 'postgres',
});

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin : process.env.CLIENT_ORIGIN
  })
  app.setGlobalPrefix('api');
  app.use(
    session({
      store: new pgStore({
        pool: pgPool,
        tableName: 'user_sessions',
        createTableIfMissing: true,
        conString: process.env.DB_CONNECTION_STRING,
        schemaName: process.env.DB_SCHEMA,
      }),
      secret: process.env.SESSION_SECRET,
      resave: false,
      cookie: { maxAge: 30 * 24 * 60 * 10 * 1000 },
      saveUninitialized: false,
    }),
  );
  app.use(passport.initialize());
  app.use(passport.session());
  await app.listen(3000);
}
bootstrap();
