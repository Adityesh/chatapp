import { Column, Entity, JoinColumn, ManyToOne, Unique } from 'typeorm';
import { BaseEntity } from '../common/entities/base.entity';
import { User } from '../user/user.entity';
import { ConnectionStatusEnum } from './enums/connection-status.enum';

@Entity({ name: 'connections' })
@Unique(['requester', 'recipient'])
export class Connection extends BaseEntity {
  @ManyToOne(() => User, (user) => user.connectionsRequested)
  @JoinColumn({ name: 'requester_id' })
  requester: User;

  @ManyToOne(() => User, (user) => user.connectionsReceived)
  @JoinColumn({ name: 'recipient_id' })
  recipient: User;

  @Column({
    type: 'enum',
    enum: ConnectionStatusEnum,
    default: ConnectionStatusEnum.PENDING,
  })
  status: ConnectionStatusEnum;
}
