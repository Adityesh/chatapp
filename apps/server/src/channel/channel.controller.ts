import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Req,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { Paginate } from 'nestjs-paginate';
import { PaginatedSearchQuery } from 'shared';
import { ChannelService } from './channel.service';
import { ProtectedGuard } from '../auth/guards/protected.guard';
import { Request } from 'express';

@Controller('channel')
@UseGuards(ProtectedGuard)
export class ChannelController {
  constructor(private readonly channelService: ChannelService) {}

  @Get()
  async getAllChannels(@Paginate(ValidationPipe) query: PaginatedSearchQuery) {
    return this.channelService.getAllChannels(query);
  }

  @Get('current')
  async getChannelsForCurrentUser(
    @Paginate(ValidationPipe) query: PaginatedSearchQuery,
    @Req() req: Request,
  ) {
    return this.channelService.getAllChannels(query, req.user['id']);
  }

  @Get(':id')
  async getChannel(@Param('id', ParseIntPipe) id: number) {
    return this.channelService.getChannel(id);
  }
}
