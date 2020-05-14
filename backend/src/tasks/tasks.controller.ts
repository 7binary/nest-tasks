import {
  Body, ClassSerializerInterceptor, Controller, Delete, Get, Logger, Param, ParseIntPipe, Patch, Post, Query, UseGuards,
  UseInterceptors, UsePipes,
  ValidationPipe,
} from '@nestjs/common';

import { TasksService } from './tasks.service';
import { TaskStatus } from './task-status.enum';
import { Task } from './task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { TaskStatusValidationPipe } from './pipe/task-status-validation.pipe';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from '../auth/get-user.decorator';
import { User } from '../auth/user.entity';

@Controller('tasks')
@UseGuards(AuthGuard())
export class TasksController {
  private logger =  new Logger('TasksController');

  constructor(private taskService: TasksService) {}

  @Get()
  async getTasks(
    @Query() filter: GetTasksFilterDto,
    @GetUser() user: User,
  ): Promise<Task[]> {
    this.logger.verbose(`>> User ${user.username} retrieving all tasks. Filter: ${JSON.stringify(filter)}`);
    return await this.taskService.getTasks(filter, user);
  }

  @Get('/:id')
  async getTaskById(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user: User,
  ): Promise<Task> {
    return await this.taskService.getTask(id, user);
  }

  @Delete('/:id')
  async deleteTaskById(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user: User,
  ): Promise<void> {
    return await this.taskService.deleteTaskById(id, user);
  }

  @Patch('/:id/status')
  async updateTaskStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body('status', TaskStatusValidationPipe) status: TaskStatus,
    @GetUser() user: User,
  ): Promise<Task> {
    return await this.taskService.updateTaskStatus(id, status, user);
  }

  @Post()
  @UsePipes(ValidationPipe)
  @UseInterceptors(ClassSerializerInterceptor)
  async createTask(
    @Body() createTaskDto: CreateTaskDto,
    @GetUser() user: User
  ): Promise<Task> {
    this.logger.verbose(`>> User ${user.username} creating a new task. Data: ${JSON.stringify(createTaskDto)}`);
    return this.taskService.createTask(createTaskDto, user);
  }
}
