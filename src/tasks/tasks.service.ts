import { Injectable } from '@nestjs/common';
import * as fs from "fs";
import { v4 as uuidv4 } from "uuid";

@Injectable()
export class TasksService {

  private file = "src/data/tasks.json";

  private readTasks() {
    return JSON.parse(fs.readFileSync(this.file, "utf8"));
  }

  private saveTasks(tasks) {
    fs.writeFileSync(this.file, JSON.stringify(tasks, null, 2));
  }

  createTask(userId: string, data) {

    const tasks = this.readTasks();

    const task = {
      id: uuidv4(),
      title: data.title,
      dueDate: data.dueDate,
      createdBy: userId
    };

    tasks.push(task);

    this.saveTasks(tasks);

    return task;
  }

  getUserTasks(userId: string) {

    const tasks = this.readTasks();

    return tasks.filter(t => t.createdBy === userId);
  }

  updateTask(taskId: string, userId: string, data) {

    const tasks = this.readTasks();

    const task = tasks.find(
      t => t.id === taskId && t.createdBy === userId
    );

    if (!task) {
      throw new Error("Task not found");
      }

    if (data.title !== undefined) task.title = data.title;
    if (data.dueDate !== undefined) task.dueDate = data.dueDate;

    this.saveTasks(tasks);

    return task;
  }

 deleteTask(taskId: string, userId: string) {

  const tasks = this.readTasks();

  const task = tasks.find(
    t => t.id === taskId && t.createdBy === userId
  );

  if (!task) {
    throw new Error("Task not found");
  }

  const filtered = tasks.filter(
    t => !(t.id === taskId && t.createdBy === userId)
  );

  this.saveTasks(filtered);

  return { message: "Task deleted" };
}

}