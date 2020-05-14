import { LoggerService } from '@nestjs/common';

export class TestLogger implements LoggerService {
  /*eslint-disable */
  log(message: string) {}
  error(message: string, trace: string) {}
  warn(message: string) {}
  debug(message: string) {}
  verbose(message: string) {}
  /*eslint-enable */
}