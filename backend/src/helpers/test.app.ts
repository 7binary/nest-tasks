import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthModule } from '../auth/auth.module';
import { typeormConfig } from '../config/typeorm.config';
import { TasksModule } from '../tasks/tasks.module';
import { TestLogger } from './test.logger';

export class TestApp {
  static async init(loggerEnabled = false): Promise<INestApplication> {
    const module = await Test.createTestingModule({
      imports: [
        TasksModule,
        AuthModule,
        TypeOrmModule.forRoot(typeormConfig),
      ],
    }).compile();

    const app: INestApplication = module.createNestApplication();
    if (loggerEnabled === false) {
      app.useLogger(new TestLogger()); // to disable logger
    }

    await app.init();

    return app;
  }
}