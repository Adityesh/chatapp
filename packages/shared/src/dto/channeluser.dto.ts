import { BaseEntityDto } from './common.dto';
import { AutoMap } from '@automapper/classes';
import { BaseUserDto } from './user.dto';
import { BaseChannelDto } from './channel.dto';

export class BaseChannelUserDto extends BaseEntityDto {
  @AutoMap(() => BaseUserDto)
  user: BaseUserDto;

  @AutoMap(() => BaseChannelDto)
  channel: BaseChannelDto;

  @AutoMap()
  isAdmin: boolean;
}