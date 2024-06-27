import { Controller, Get, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { ProtectedGuard } from 'src/guards/protected.guard';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('search')
  @UseGuards(ProtectedGuard)
  async searchUsers() {
    return this.userService.searchUsers();
  }
}
