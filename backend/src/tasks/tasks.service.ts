import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Task } from './task.entity';
import { User } from '../users/user.entity';

@Injectable()
export class TasksService {

  constructor(
    @InjectRepository(Task)
    private tasksRepo: Repository<Task>,

    @InjectRepository(User)
    private usersRepo: Repository<User>,
  ) {}

  async createTask(userId: string, data) {

    const user = await this.usersRepo.findOne({
      where: { id: userId }
    });

    if (!user) {
      throw new NotFoundException("User not found");
    }

    const task = this.tasksRepo.create({
      title: data.title,
      dueDate: data.dueDate,
      user
    });

    const saved = await this.tasksRepo.save(task);

    return {
      id: saved.id,
      title: saved.title,
      dueDate: saved.dueDate
    };
  }

  async getUserTasks(userId: string) {

    const tasks = await this.tasksRepo.find({
      where: { user: { id: userId } }
    });

    return tasks.map(task => ({
      id: task.id,
      title: task.title,
      dueDate: task.dueDate
    }));
  }

  async updateTask(taskId: string, userId: string, data) {

    const task = await this.tasksRepo.findOne({
      where: { id: taskId, user: { id: userId } }
    });

    if (!task) {
      throw new NotFoundException("Task not found");
    }

    if (data.title !== undefined) task.title = data.title;
    if (data.dueDate !== undefined) task.dueDate = data.dueDate;

    const updated = await this.tasksRepo.save(task);

    return {
      id: updated.id,
      title: updated.title,
      dueDate: updated.dueDate
    };
  }

  async deleteTask(taskId: string, userId: string) {

    const task = await this.tasksRepo.findOne({
      where: { id: taskId, user: { id: userId } }
    });

    if (!task) {
      throw new NotFoundException("Task not found");
    }

    await this.tasksRepo.remove(task);

    return { message: "Task deleted" };
  }
}