import { Module } from '@nestjs/common';
import { ConnectionController } from './connection.controller';
import { ConnectionService } from './connection.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Connection } from 'src/connection/connection.entity';
import { ChannelModule } from '../channel/channel.module';

@Module({
  imports: [TypeOrmModule.forFeature([Connection]), ChannelModule],
  providers: [ConnectionService],
  controllers: [ConnectionController],
  exports: [ConnectionService],
})
export class ConnectionModule {}
