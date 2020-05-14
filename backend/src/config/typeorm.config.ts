import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as config from 'config';
import { DbConfigInterface } from './db-config.interface';

const dbConfig: DbConfigInterface = config.get('db');

export const typeormConfig: TypeOrmModuleOptions = {
  type: dbConfig.type,
  host: process.env.RDS_HOSTNAME || dbConfig.host,
  port: process.env.RDS_PORT && parseInt(process.env.RDS_PORT) || dbConfig.port,
  username: process.env.RDS_USERNAME || dbConfig.username,
  password: process.env.RDS_PASSWORD || dbConfig.password,
  database: process.env.RDS_DB_NAME || dbConfig.database,
  synchronize: process.env.TYPEORM_SYNC && process.env.TYPEORM_SYNC == 'true' || dbConfig.synchronize,
  entities: [__dirname + '/../**/*.entity.{js,ts}'],
};
