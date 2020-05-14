import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import * as config from 'config';

import { AppModule } from './app.module';
import { ServerConfigInterface } from './config/server-config.interface';

async function bootstrap() {
  const serverConfig: ServerConfigInterface = config.get('server');
  const logger = new Logger('bootstrap');
  const port = process.env.PORT && parseInt(process.env.PORT) || serverConfig.port;

  logger.debug(`>> process.env.NODE_ENV: `, process.env.NODE_ENV);
  logger.debug(`>> serverConfig: `, JSON.stringify(serverConfig));

  const app = await NestFactory.create(AppModule);

  if (process.env.NODE_ENV === 'development' ||  process.env.NODE_ENV === 'test') {
    app.enableCors();
    logger.debug(`>> Cors enabled: ALL`);
  } else {
    app.enableCors({ origin: serverConfig.origin });
    logger.debug(`>> Cors enabled: ${serverConfig.origin}`);
  }

  await app.listen(port);

  logger.debug(`>> Application started on port ${port}`);
}

bootstrap();
