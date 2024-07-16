import { Controller, Get, Param, Query, Req, UseGuards } from '@nestjs/common';
import { ProtectedGuard } from 'src/guards/protected.guard';
import { ConnectionService } from './connection.service';
import { GetConnectionWithUserDto, GetConnectionsDto } from '@repo/shared';

@Controller('connection')
export class ConnectionController {
  constructor(private readonly connectionService: ConnectionService) {}

  @Get('all')
  @UseGuards(ProtectedGuard)
  getConnections(@Req() req: any, @Query() query: GetConnectionsDto) {
    return this.connectionService.getConnections(req.user.id, query);
  }
}
