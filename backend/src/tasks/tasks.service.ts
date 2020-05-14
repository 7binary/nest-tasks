import { Injectable, NotFoundException } from '@nestjs/common';
import { TaskStatus } from './task-status.enum';
import { Task } from './task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { TaskRepository } from './task.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { User } from '../auth/user.entity';

@Injectable()
export class TasksService {
  constructor(@InjectRepository(TaskRepository) private taskRepository: TaskRepository) {}

  async getTasks(filter: GetTasksFilterDto, user: User): Promise<Task[]> {
    return await this.taskRepository.getTasks(filter, user);
  }

  async getTask(id: number, user: User): Promise<Task> {
    const task = await this.taskRepository.getTask(id, user);

    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }

    return task;
  }

  async deleteTaskById(id: number, user: User): Promise<void> {
    const result = await this.taskRepository.delete({ id, user });

    if (result.affected === 0) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }
  }

  async updateTaskStatus(id: number, status: TaskStatus, user: User): Promise<Task> {
    const task = await this.getTask(id, user);
    task.status = status;
    await task.save();

    return task;
  }

  async createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
    return await this.taskRepository.createTask(createTaskDto, user);
  }
}
