import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import {
  createMap,
  extend,
  forMember,
  mapFrom,
  Mapper,
} from '@automapper/core';
import { Injectable } from '@nestjs/common';
import {
  BaseConnectionDto,
  BaseEntityDto,
  BaseUserDto,
  BaseChannelDto,
  BaseMessageDto,
  BaseMessageStatusDto,
  BaseMessageAttachmentDto,
  BaseChannelUserDto,
} from 'shared';
import { BaseEntity } from './entities/base.entity';
import { User } from '../user/user.entity';
import { Connection } from '../connection/connection.entity';
import { Channel } from '../channel/channel.entity';
import { ChannelUser } from '../channeluser/channeluser.entity';
import { MessageAttachment } from '../messageattachment/messageattachment.entity';
import { MessageStatus } from '../messagestatus/messagestatus.entity';
import { Message } from '../message/message.entity';

@Injectable()
export class DtoMapper extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  override get profile() {
    return (mapper: Mapper) => {
      createMap(mapper, BaseEntity, BaseEntityDto);
      createMap(mapper, User, BaseUserDto, extend(BaseEntity, BaseEntityDto));
      createMap(
        mapper,
        Connection,
        BaseConnectionDto,
        extend(BaseEntity, BaseEntityDto),
      );
      createMap(
        mapper,
        Channel,
        BaseChannelDto,
        forMember<Channel, BaseChannelDto>(
          (d) => d.totalUsers,
          mapFrom((s) => s.users.length),
        ),
        extend(BaseEntity, BaseEntityDto),
      );
      createMap(
        mapper,
        ChannelUser,
        BaseChannelUserDto,
        extend(BaseEntity, BaseEntityDto),
      );
      createMap(
        mapper,
        Message,
        BaseMessageDto,
        extend(BaseEntity, BaseEntityDto),
      );
      createMap(
        mapper,
        MessageStatus,
        BaseMessageStatusDto,
        extend(BaseEntity, BaseEntityDto),
      );
      createMap(
        mapper,
        MessageAttachment,
        BaseMessageAttachmentDto,
        extend(BaseEntity, BaseEntityDto),
      );
    };
  }
}
