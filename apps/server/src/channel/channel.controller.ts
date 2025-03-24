import { Controller, Get, UseGuards, ValidationPipe } from '@nestjs/common';
import { Paginate } from 'nestjs-paginate';
import { PaginatedSearchQuery } from 'shared';
import { ChannelService } from './channel.service';
import { ProtectedGuard } from '../auth/guards/protected.guard';

@Controller('channel')
@UseGuards(ProtectedGuard)
export class ChannelController {
  constructor(private readonly channelService: ChannelService) {}

  @Get()
  async getAllChannels(@Paginate(ValidationPipe) query: PaginatedSearchQuery) {
    return this.channelService.getAllChannels(query);
  }
}
