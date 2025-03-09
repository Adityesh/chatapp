import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { AuthModule } from './auth/auth.module';
import { ChatController } from './chat/chat.controller';
import { ChatModule } from './chat/chat.module';
import { SocketGateway } from './socket/socket.gateway';
import { UserController } from './user/user.controller';
import { UserModule } from './user/user.module';
import { SocketModule } from './socket/socket.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { ConnectionController } from './connection/connection.controller';
import { ConnectionModule } from './connection/connection.module';
import { DatabaseModule } from './database/database.module';
import { ConfigurationModule } from './configuration/configuration.module';

@Module({
  imports: [
    ConfigurationModule,
    AuthModule,
    PassportModule.register({ session: true, defaultStrategy: 'local' }),
    ChatModule,
    UserModule,
    SocketModule,
    CloudinaryModule,
    ConnectionModule,
    DatabaseModule,
  ],
  controllers: [ChatController, UserController, ConnectionController],
  providers: [SocketGateway],
})
export class AppModule {}
