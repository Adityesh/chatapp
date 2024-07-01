import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ProtectedGuard } from 'src/guards/protected.guard';
import { UserService } from './user.service';
import {
  GetConnectionWithUserDto,
  GetUserDto,
  SearchUsersDto,
  SendConnectionDto,
  UpdateConnectionDto,
} from '@repo/shared';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('search')
  @UseGuards(ProtectedGuard)
  async searchUsers(
    @Req() req,
    @Query() { limit, page, query }: SearchUsersDto,
  ) {
    return await this.userService.searchUsers(
      req.user.id,
      { limit, page },
      query,
    );
  }

  @Get(':userId')
  @UseGuards(ProtectedGuard)
  async getUser(@Param() { userId }: GetUserDto) {
    return this.userService.getUser(userId);
  }

  @Post('connection')
  @UseGuards(ProtectedGuard)
  async sendConnectionInvite(@Body() sendConnectionDto: SendConnectionDto) {
    return this.userService.sendConnectionInvite(sendConnectionDto);
  }

  @Patch('connection')
  @UseGuards(ProtectedGuard)
  async updateConnectionInvite(
    @Body() updateConnectionInvite: UpdateConnectionDto,
  ) {
    return this.userService.updateConnectionInvite(updateConnectionInvite);
  }

  @Get()
  @UseGuards(ProtectedGuard)
  async getLoggedInUser(@Req() req) {
    return this.userService.getUser(req.user.id);
  }

  @Get('connection/:userId')
  @UseGuards(ProtectedGuard)
  async getConnectionWithUser(
    @Req() req,
    @Param() { userId }: GetConnectionWithUserDto,
  ) {
    return this.userService.getConnectionWithUser(req.user.id, userId);
  }
}
