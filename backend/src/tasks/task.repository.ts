import { EntityRepository, Repository } from 'typeorm';
import { Task } from './task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { TaskStatus } from './task-status.enum';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { User } from '../auth/user.entity';
import { InternalServerErrorException, Logger } from '@nestjs/common';

@EntityRepository(Task)
export class TaskRepository extends Repository<Task> {
  private logger = new Logger('TaskRepository');

  async getTasks(filter: GetTasksFilterDto, user: User): Promise<Task[]> {
    const { status, search } = filter;
    const query = this.createQueryBuilder('task');
    query.andWhere('task.user = :userId', { userId: user.id });
    if (status) {
      query.andWhere('task.status = :status', { status });
    }
    if (search) {
      query.andWhere('(task.title LIKE :search OR task.description LIKE :search)', { search: `%${search}%` });
    }

    try {
      return await query.getMany();
    } catch (error) {
      this.logger.error(`>> User ${user.username} get tasks with filter ${JSON.stringify(filter)}`, error.stack);
      throw new InternalServerErrorException();
    }
  }

  async getTask(id: number, user: User): Promise<Task|undefined> {
    return await this.findOne({ where: { user: user.id, id } });
  }

  async createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
    const { title, description } = createTaskDto;

    const task = new Task();
    task.title = title;
    task.description = description;
    task.status = TaskStatus.OPEN;
    task.user = user;
    await task.save();

    return task;
  }
}
