import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Body,
  Param,
  ParseUUIDPipe,
  Req,
  UseGuards
} from '@nestjs/common';

import { ApiBearerAuth } from '@nestjs/swagger';

import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

import { JwtGuard } from '../auth/jwt.guard';

@Controller('tasks')
export class TasksController {

  constructor(private tasksService: TasksService) {}

  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  @Post()
  createTask(@Req() req, @Body() dto: CreateTaskDto) {

    const userId = req.user.userId;

    return this.tasksService.createTask(userId, dto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  @Get()
  getTasks(@Req() req) {

    const userId = req.user.userId;

    return this.tasksService.getUserTasks(userId);
  }

  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  @Patch(':id')
  updateTask(
    @Req() req,
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: UpdateTaskDto
  ) {

    const userId = req.user.userId;

    return this.tasksService.updateTask(id, userId, dto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  @Delete(':id')
  deleteTask(
    @Req() req,
    @Param('id', new ParseUUIDPipe()) id: string
  ) {

    const userId = req.user.userId;

    return this.tasksService.deleteTask(id, userId);
  }

}
