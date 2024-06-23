import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { ConnectionStatusEnum } from '../enums/connection.enum';
import { BaseEntity } from './base.entity';
import { User } from './user.entity';

@Entity({ name: 'connections' })
export class Connection extends BaseEntity {
  @ManyToOne(() => User, (user) => user.connectionsInitiated)
  @JoinColumn({ name: 'requested_by' })
  requestedBy: User;

  @ManyToOne(() => User, (user) => user.connectionsReceived)
  @JoinColumn({ name: 'addressed_to' })
  addressedTo: User;

  @Column({
    type: 'enum',
    enum: ConnectionStatusEnum,
    default: ConnectionStatusEnum.PENDING,
  })
  status: ConnectionStatusEnum;
}
