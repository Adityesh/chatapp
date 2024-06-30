import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  GetChatDetailsDto,
  GetMessagesDto,
  InitateChatDto,
  SendMessageDto,
} from 'src/dto/chat.dto';
import { ProtectedGuard } from 'src/guards/protected.guard';
import { ChatService } from './chat.service';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post('init')
  @UseGuards(ProtectedGuard)
  async initateChat(@Body() initateChatDto: InitateChatDto) {
    return await this.chatService.initateChat(initateChatDto);
  }

  @Get('details/:channelId')
  @UseGuards(ProtectedGuard)
  async getChatDetails(@Param() getChatDetailsDto: GetChatDetailsDto) {
    return this.chatService.getChatDetails(getChatDetailsDto);
  }

  @Post('/message/:channelId')
  @UseGuards(ProtectedGuard)
  async sendMessage(
    @Body() sendMessageDto: SendMessageDto,
    @Param() { channelId }: GetChatDetailsDto,
  ) {
    return this.chatService.sendMessage(sendMessageDto, channelId);
  }

  @Get('/message/:channelId')
  @UseGuards(ProtectedGuard)
  async getMessages(
    @Param() { channelId }: GetChatDetailsDto,
    @Query() { limit, page }: GetMessagesDto,
  ) {
    return this.chatService.getMessages(channelId, { page, limit });
  }
}
