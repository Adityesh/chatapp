import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { AuthModule } from './auth/auth.module';
import { SocketGateway } from './socket/socket.gateway';
import { UserController } from './user/user.controller';
import { UserModule } from './user/user.module';
import { SocketModule } from './socket/socket.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { ConnectionController } from './connection/connection.controller';
import { ConnectionModule } from './connection/connection.module';
import { DatabaseModule } from './database/database.module';
import { ConfigurationModule } from './configuration/configuration.module';
import { MessageModule } from './message/message.module';
import { MessageattachmentModule } from './messageattachment/messageattachment.module';
import { MessagestatusModule } from './messagestatus/messagestatus.module';
import { ChanneluserController } from './channeluser/channeluser.controller';
import { ChannelModule } from './channel/channel.module';
import { MessageController } from './message/message.controller';
import { AutomapperModule } from '@automapper/nestjs';
import { classes } from '@automapper/classes';
import { DtoMapper } from './common/dtomapper';
import { ChannelUserModule } from './channeluser/channeluser.module';

@Module({
  imports: [
    AutomapperModule.forRoot({
      strategyInitializer: classes(),
    }),
    ConfigurationModule,
    AuthModule,
    PassportModule.register({ session: true, defaultStrategy: 'local' }),
    UserModule,
    SocketModule,
    CloudinaryModule,
    ConnectionModule,
    DatabaseModule,
    MessageModule,
    MessageattachmentModule,
    MessagestatusModule,
    ChannelUserModule,
    ChannelModule,
  ],
  controllers: [
    UserController,
    ConnectionController,
    MessageController,
    ChanneluserController,
  ],
  providers: [SocketGateway, DtoMapper],
})
export class AppModule {}
