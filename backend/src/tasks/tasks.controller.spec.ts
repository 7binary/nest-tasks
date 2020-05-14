import { INestApplication } from '@nestjs/common';
import * as supertest from 'supertest';

import { UserRepository } from '../auth/user.repository';
import { User } from '../auth/user.entity';
import { TaskRepository } from './task.repository';
import { AuthService } from '../auth/auth.service';
import { TaskStatus } from './task-status.enum';
import { Task } from './task.entity';
import { TestApp } from '../helpers/test.app';

describe('TasksController', () => {
  let app: INestApplication;
  let taskRepository: TaskRepository;
  let userRepository: UserRepository;
  let testUser: User;
  let testTask: Task;
  let testUserAccessToken: string;

  beforeAll(async () => {
    // init app and repositories
    app = await TestApp.init();
    taskRepository = await app.get<TaskRepository>(TaskRepository);
    userRepository = await app.get<UserRepository>(UserRepository);
    const authService = await app.get<AuthService>(AuthService);

    // Generate test user and get his JWT-token
    const username = 'TaskMan';
    const password = '123123Aa';
    testUser = await userRepository.getTestUser(username, password);
    const { accessToken } = await authService.signIn({ username, password });
    testUserAccessToken = accessToken;
  });

  afterAll(async () => {
    await app.close();
  });

  it('should create a task', async () => {
    await taskRepository.createQueryBuilder().delete().execute();
    const { body } = await supertest.agent(app.getHttpServer())
      .post('/tasks')
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${testUserAccessToken}`)
      .send({ title: 'First task', description: 'Do it right now!' })
      .expect('Content-Type', /json/)
      .expect(201);
    testTask = new Task(body);
  });

  it('should get a task by id', async () => {
    await supertest.agent(app.getHttpServer())
      .get(`/tasks/${testTask.id}`)
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${testUserAccessToken}`)
      .expect('Content-Type', /json/)
      .expect(200)
      .then(response => expect(response.body.id).toEqual(testTask.id));
  });

  it('should change task status', async () => {
    const { body } = await supertest.agent(app.getHttpServer())
      .patch(`/tasks/${testTask.id}/status`)
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${testUserAccessToken}`)
      .send({ status: TaskStatus.DONE })
      .expect('Content-Type', /json/)
      .expect(200);
    testTask = new Task(body);
  });

  it('should get list of tasks', async () => {
    const { body } = await supertest.agent(app.getHttpServer())
      .get('/tasks')
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${testUserAccessToken}`)
      .query({ search: 'First' })
      .expect('Content-Type', /json/)
      .expect(200);

    expect(body.length).toEqual(1);
  });
});