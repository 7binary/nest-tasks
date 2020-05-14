import { BaseEntity, Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, RelationId, UpdateDateColumn } from 'typeorm';
import { TaskStatus } from './task-status.enum';
import { User } from '../auth/user.entity';

@Entity()
export class Task extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 100, nullable: false })
  title!: string;

  @Column({ length: 255, nullable: true })
  description?: string;

  @Column({ type: 'enum', enum: TaskStatus, default: TaskStatus.OPEN, nullable: false })
  status!: TaskStatus;

  @ManyToOne(type => User, user => user.tasks, { eager: false, onDelete: 'CASCADE' })
  user?: User;

  @RelationId((task: Task) => task.user)
  userId?: number;

  @CreateDateColumn()
  createdAt?: Date;

  @UpdateDateColumn()
  updatedAt?: Date;

  constructor(partial?: Partial<Task>) {
    super();
    if (partial) {
      Object.assign(this, partial);
    }
  }
}