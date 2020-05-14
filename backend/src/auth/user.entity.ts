import { BaseEntity, Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, Unique, UpdateDateColumn } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { Exclude } from 'class-transformer';
import { Task } from '../tasks/task.entity';

@Entity()
@Unique(['username'])
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  username!: string;

  @Column()
  @Exclude()
  password?: string;

  @Column()
  @Exclude()
  salt!: string;

  @OneToMany(type => Task, task => task.user)
  tasks?: Task[];

  @CreateDateColumn()
  createdAt?: Date;

  @UpdateDateColumn()
  updatedAt?: Date;

  constructor(partial?: Partial<User>) {
    super();
    if (partial) {
      Object.assign(this, partial);
    }
  }

  async generatePasshash(password: string): Promise<void> {
    this.salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(password, this.salt);
  }

  async validatePassword(password: string): Promise<boolean> {
    const passhash = await bcrypt.hash(password, this.salt);
    return this.password === passhash;
  }
}