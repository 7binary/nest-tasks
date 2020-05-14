import { INestApplication } from '@nestjs/common';
import * as supertest from 'supertest';

import { UserRepository } from './user.repository';
import { User } from './user.entity';
import { TestApp } from '../helpers/test.app';

describe('AuthController', () => {
  let app: INestApplication;
  let userRepository: UserRepository;
  let testUser: User;
  let testUserAccessToken: string;

  const username = 'AuthMan';
  const password = '123123Aa';

  beforeAll(async () => {
    app = await TestApp.init();
    userRepository = await app.get<UserRepository>(UserRepository);
    await userRepository.createQueryBuilder().where('username = :username', { username }).delete().execute();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should sign up', async () => {
    const { body } = await supertest.agent(app.getHttpServer())
      .post('/auth/signup')
      .set('Accept', 'application/json')
      .send({ username, password })
      .expect('Content-Type', /json/)
      .expect(201);
    expect(body.username).toEqual(username);
    testUser = new User(body);
  });

  it('should sign in', async () => {
    const { body } = await supertest.agent(app.getHttpServer())
      .post('/auth/signin')
      .set('Accept', 'application/json')
      .send({ username, password })
      .expect('Content-Type', /json/)
      .expect(200);
    expect(body.accessToken).toBeDefined();
    testUserAccessToken = body.accessToken;
  });

  it('should find me', async () => {
    const { body } = await supertest.agent(app.getHttpServer())
      .get('/auth/me')
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${testUserAccessToken}`)
      .expect('Content-Type', /json/)
      .expect(200);
    expect(body.username).toEqual(username);
  });
});