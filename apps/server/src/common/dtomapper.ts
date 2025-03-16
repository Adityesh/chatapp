import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { createMap, extend, Mapper } from '@automapper/core';
import { Injectable } from '@nestjs/common';
import { BaseEntityDto, BaseUserDto } from 'shared';
import { BaseEntity } from './entities/base.entity';
import { User } from '../user/user.entity';

@Injectable()
export class DtoMapper extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  override get profile() {
    return (mapper: Mapper) => {
      createMap(mapper, BaseEntity, BaseEntityDto);
      createMap(mapper, User, BaseUserDto, extend(BaseEntity, BaseEntityDto));
    };
  }
}
