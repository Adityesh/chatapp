import {
  Body,
  Controller,
  Get,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  Post,
  Query,
  Req,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ProtectedGuard } from 'src/guards/protected.guard';
import { ChatService } from './chat.service';
import {
  GetChatDetailsDto,
  GetMessagesDto,
  InitateChatDto,
  SendMessageDto,
  GetChannelsDto,
} from '@repo/shared';
import { FileFieldsInterceptor } from '@nestjs/platform-express';

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
  @UseInterceptors(FileFieldsInterceptor([{ name: 'files', maxCount: 3 }]))
  @UseGuards(ProtectedGuard)
  async sendMessage(
    @Body() sendMessageDto: SendMessageDto,
    @Param() { channelId }: GetChatDetailsDto,
    @UploadedFiles(
      // new ParseFilePipe({
      //   validators: [new MaxFileSizeValidator({ maxSize: 1 * 1024 * 1024 })],
      // }),
    )
    allFiles: { files?: Express.Multer.File[] },
  ) {
    return this.chatService.sendMessage(
      sendMessageDto,
      channelId,
      allFiles.files,
    );
  }

  @Get('/message/:channelId')
  @UseGuards(ProtectedGuard)
  async getMessages(
    @Param() { channelId }: GetChatDetailsDto,
    @Query() { limit, page }: GetMessagesDto,
  ) {
    return this.chatService.getMessages(channelId, { page, limit });
  }

  @Get('/channels')
  @UseGuards(ProtectedGuard)
  async getChannels(@Req() req, @Query() { limit, page }: GetChannelsDto) {
    return this.chatService.getChannels(req.user.id, { limit, page });
  }
}
