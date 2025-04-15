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
import { ProtectedGuard } from '../auth/guards/protected.guard';
import { MessageService } from './message.service';
import {
  CreateMessageDto,
  DeleteMessageDto,
  EditMessageDto,
  PaginatedSearchQuery,
} from 'shared';
import { Paginate } from 'nestjs-paginate';

@Controller('message')
@UseGuards(ProtectedGuard)
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @Post('')
  async create(
    @Body() createMessageDto: CreateMessageDto,
    @Req() req: Request,
  ) {
    return await this.messageService.createMessage(
      createMessageDto,
      req['user'].id,
    );
  }

  @Patch()
  async edit(@Body() editMessageDto: EditMessageDto, @Req() req: Request) {
    return await this.messageService.editMessage(
      editMessageDto,
      req['user'].id,
    );
  }

  @Get(':channelId')
  async get(
    @Paginate(ValidationPipe) query: PaginatedSearchQuery,
    @Param('channelId', ParseIntPipe) channelId: number,
  ) {
    return await this.messageService.getMessages(query, channelId);
  }

  @Delete('')
  async delete(
    @Body() deleteMessageDto: DeleteMessageDto,
    @Req() req: Request,
  ) {
    return await this.messageService.deleteMessage(
      deleteMessageDto,
      req['user'].id,
    );
  }
}
