import { Task } from 'src/tasks/task.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

@Entity()
export class User {

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

@Column({ default: "" })
firstName: string;

@Column({ default: "" })
lastName: string;

@Column({ default: "" })
phone: string;

  @OneToMany(() => Task, (task: Task) => task.user)
  tasks: Task[];
}