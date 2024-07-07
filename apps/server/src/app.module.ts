import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ChatController } from './chat/chat.controller';
import { ChatModule } from './chat/chat.module';
import { EventsGateway } from './events/events.gateway';
import { UserController } from './user/user.controller';
import { UserModule } from './user/user.module';
import { SocketService } from './socket/socket.service';
import { SocketModule } from './socket/socket.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    AuthModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        url: configService.get('DB_CONNECTION_STRING'),
        database: configService.get('DB_DATABASE'),
        schema: configService.get('DB_SCHEMA'),
        entities: ['dist/**/*.entity{.ts,.js}'],
        migrationsTableName: 'chatapp_migrations',
        autoLoadEntities: true,
        migrations: [__dirname + '/migrations/**/*{.ts,.js}'],
        seeds: [__dirname + '/seeds/**/*{.ts,.js}'],
        factories: [__dirname + '/factories/**/*{.ts,.js}'],
        cli: {
          migrationsDir: __dirname + '/migrations/',
        },
        migrationsRun: true,
        logging : ["error"]
      }),
      inject: [ConfigService],
    }),
    PassportModule.register({ session: true, defaultStrategy: 'local' }),
    ChatModule,
    UserModule,
    SocketModule,
  ],
  controllers: [AppController, ChatController, UserController],
  providers: [AppService, EventsGateway],
})
export class AppModule {}
