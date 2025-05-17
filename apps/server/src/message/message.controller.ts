import {
  Body,
  Controller,
  Delete,
  FileTypeValidator,
  Get,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  ParseIntPipe,
  Patch,
  Post,
  Req,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
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
import { SocketService } from '../socket/socket.service';
import { FilesInterceptor } from '@nestjs/platform-express';

@Controller('message')
@UseGuards(ProtectedGuard)
export class MessageController {
  constructor(
    private readonly messageService: MessageService,
    private readonly socketService: SocketService,
  ) {}

  @Post()
  @UseInterceptors(FilesInterceptor('files', 3))
  async create(
    @Body() createMessageDto: CreateMessageDto,
    @Req() req: Request,
    @UploadedFiles(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 1024 * 1024 }),
          new FileTypeValidator({ fileType: '.(png|jpeg|jpg|gif)' }),
        ],
        fileIsRequired: false,
      }),
    )
    files?: Array<Express.Multer.File>,
  ) {
    const currentUserId: number = req['user'].id;
    const savedMessage = await this.messageService.createMessage(
      createMessageDto,
      currentUserId,
      files,
    );
    this.socketService.broadcastMessage(
      createMessageDto.channelId,
      currentUserId,
      req['sessionID'],
      savedMessage,
    );
    return savedMessage;
  }

  @Patch()
  @UseInterceptors(FilesInterceptor('files', 3))
  async edit(
    @Body() editMessageDto: EditMessageDto,
    @Req() req: Request,
    @UploadedFiles(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 1024 * 1024 }),
          new FileTypeValidator({ fileType: '.(png|jpeg|jpg|gif)' }),
        ],
        fileIsRequired: false,
      }),
    )
    files?: Array<Express.Multer.File>,
  ) {
    const currentUserId: number = req['user'].id;
    const editedMessage = await this.messageService.editMessage(
      editMessageDto,
      currentUserId,
      files,
    );
    this.socketService.broadcastMessage(
      editedMessage.channel.id,
      currentUserId,
      req['sessionID'],
      editedMessage,
      'edit',
    );
    return editedMessage;
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
    const currentUserId: number = req['user'].id;
    const deleteResult = await this.messageService.deleteMessage(
      deleteMessageDto,
      currentUserId,
    );
    this.socketService.broadcastMessage(
      deleteMessageDto.channelId,
      currentUserId,
      req['sessionID'],
      undefined,
      'delete',
      deleteMessageDto.messageId,
    );
    return deleteResult;
  }
}
