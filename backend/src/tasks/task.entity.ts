import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { User } from '../users/user.entity';

@Entity()
export class Task {

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

@Column({ type: 'date' })
dueDate: Date;

  @ManyToOne(() => User, user => user.tasks)
  user: User;
}