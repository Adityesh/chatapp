import { Controller, Get, Query, Req, UseGuards } from '@nestjs/common';
import { ProtectedGuard } from 'src/auth/guards/protected.guard';
import { ConnectionService } from './connection.service';
import { GetConnectionsDto } from '@repo/shared';

@Controller('connection')
export class ConnectionController {
  constructor(private readonly connectionService: ConnectionService) {}

  @Get('all')
  @UseGuards(ProtectedGuard)
  getConnections(@Req() req: any, @Query() query: GetConnectionsDto) {
    return this.connectionService.getConnections(req.user.id, query);
  }
}
