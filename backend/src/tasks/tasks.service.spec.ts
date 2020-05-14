import { Test } from '@nestjs/testing';
import { TasksService } from './tasks.service';
import { TaskRepository } from './task.repository';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { TaskStatus } from './task-status.enum';
import { User } from '../auth/user.entity';
import { Task } from './task.entity';
import { NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';

const mockUser = new User({ username: 'Binary' });

const mockTaskRepository = () => ({
  getTasks: jest.fn(),
  getTask: jest.fn(),
  createTask: jest.fn(),
  delete: jest.fn(),
});

describe('TaskService', () => {
  let tasksService: TasksService;
  let taskRepository: any;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        TasksService,
        { provide: TaskRepository, useFactory: mockTaskRepository },
      ],
    }).compile();

    tasksService = await module.get<TasksService>(TasksService);
    taskRepository = await module.get<TaskRepository>(TaskRepository);
  });

  describe('getTasks', () => {
    it('should get list of tasks', async () => {
      taskRepository.getTasks.mockResolvedValue('someValue');
      expect(taskRepository.getTasks).not.toHaveBeenCalled();

      const filter: GetTasksFilterDto = { status: TaskStatus.OPEN, search: 'First' };
      const result = await tasksService.getTasks(filter, mockUser);

      expect(taskRepository.getTasks).toHaveBeenCalled();
      expect(result).toEqual('someValue');
    });
  });

  describe('getTask', () => {
    it('finds one task by ID and return it', async () => {
      const mockTask = new Task({ title: 'Second', description: 'Two' });
      taskRepository.getTask.mockResolvedValue(mockTask);
      const result = await tasksService.getTask(1, mockUser);
      expect(result).toEqual(mockTask);
      expect(taskRepository.getTask).toHaveBeenCalledWith(1, mockUser);
    });

    it('throws an error as task is not found', async () => {
      taskRepository.getTask.mockResolvedValue(null);
      expect(tasksService.getTask(1, mockUser)).rejects.toThrow(NotFoundException);
    });

    describe('createTask', () => {
      it('create a new task and returns it', async () => {
        const dto: CreateTaskDto = { title: 'Third', description: 'Three' };
        const mockTask = new Task(dto);
        taskRepository.createTask.mockResolvedValue(mockTask);

        expect(taskRepository.createTask).not.toHaveBeenCalled();
        const result: any = await tasksService.createTask(dto, mockUser);
        expect(taskRepository.createTask).toHaveBeenCalledWith(dto, mockUser);
        expect(result.title).toEqual(mockTask.title);
      });

      it('throws an error as create a new task', async () => {
        const dto: CreateTaskDto = { title: '', description: '' };
        const mockTask = new Task(dto);
        taskRepository.createTask.mockResolvedValue(mockTask);

        expect(tasksService.createTask(dto, mockUser)).rejects;
      });
    });

    describe('deleteTask', () => {
      it('delete task successfull', async () => {
        taskRepository.delete.mockResolvedValue({ affected: 1 });

        expect(taskRepository.delete).not.toHaveBeenCalled();
        await tasksService.deleteTaskById(1, mockUser);
        expect(taskRepository.delete).toHaveBeenCalledWith({id: 1, user: mockUser});
      });

      it('throws an error as delete task', async () => {
        taskRepository.delete.mockResolvedValue({ affected: 0 });
        expect(tasksService.deleteTaskById(1, mockUser)).rejects.toThrow(NotFoundException);
      });
    });

    describe('updateTaskStatus', () => {
      it('update task status successfull', async () => {
        const mockTask = new Task({ title: 'Second', description: 'Two', status: TaskStatus.OPEN });
        mockTask.save = jest.fn();
        taskRepository.getTask.mockResolvedValue(mockTask);
        const result = await tasksService.updateTaskStatus(1, TaskStatus.DONE, mockUser);
        expect(result).toEqual(mockTask);
        expect(result.status).toEqual(TaskStatus.DONE);
        expect(mockTask.save).toHaveBeenCalled();
      });

      it('throws an error as update task status', async () => {
        taskRepository.getTask.mockResolvedValue(null);
        expect(tasksService.updateTaskStatus(1, TaskStatus.DONE, mockUser)).rejects.toThrow(NotFoundException);
      });
    });
  });
});