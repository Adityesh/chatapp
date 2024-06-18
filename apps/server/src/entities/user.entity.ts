import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  BeforeInsert,
} from 'typeorm';
import * as bcrypt from 'bcrypt';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'full_name' })
  fullName: string;

  @Column({ name: 'user_name' })
  userName: string;

  @Column({ name: 'password', type: 'varchar', nullable: true })
  password: string;

  @Column({ default: false, name: 'is_deleted' })
  isDeleted: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @Column({ name: 'google_id', nullable: true })
  googleId: string;

  @Column({ name: 'avatar_url', nullable: true, default: null })
  avatarUrl: string;

  @Column({ name: 'email' })
  email: string;

  @BeforeInsert()
  async hashPassword(): Promise<void> {
    if (!this.password) return;
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
  }
}
