export interface DbConfigInterface {
  type: 'postgres' | 'mongodb' | 'mysql' | 'mariadb';
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
  synchronize: boolean;
}