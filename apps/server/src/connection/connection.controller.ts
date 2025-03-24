import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Req,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { ConnectionService } from './connection.service';
import {
  CreateConnectionDto,
  PaginatedSearchQuery,
  UpdateConnectionDto,
} from 'shared';
import { Request } from 'express';
import { ProtectedGuard } from '../auth/guards/protected.guard';
import { Paginate } from 'nestjs-paginate';

@Controller('connection')
@UseGuards(ProtectedGuard)
export class ConnectionController {
  constructor(private readonly connectionService: ConnectionService) {}

  @Post()
  async create(
    @Req() req: Request,
    @Body() { recipient }: CreateConnectionDto,
  ) {
    return this.connectionService.createConnection(req.user['id'], recipient);
  }

  @Patch()
  async update(@Body() updateConnectionDto: UpdateConnectionDto) {
    return this.connectionService.updateConnection(updateConnectionDto);
  }

  @Get()
  async getAll(@Paginate(ValidationPipe) query: PaginatedSearchQuery) {
    return this.connectionService.getAllConnections(query);
  }

  @Get(':userId')
  async get(
    @Param('userId', ParseIntPipe) userId: number,
    @Req() req: Request,
  ) {
    return this.connectionService.getConnection(req.user['id'], userId);
  }

  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number, @Req() req: Request) {
    return this.connectionService.deleteConnection(id, req.user['id']);
  }
}
