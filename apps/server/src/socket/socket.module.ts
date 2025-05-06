import { Module, Global } from '@nestjs/common';
import { SocketService } from './socket.service';
import { UserModule } from '../user/user.module';

@Global()
@Module({
  controllers: [],
  providers: [SocketService],
  exports: [SocketService],
  imports: [UserModule],
})
export class SocketModule {}
