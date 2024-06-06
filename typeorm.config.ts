import { DataSource } from 'typeorm';
import { ormconfig } from './src/config/db.config';

export default new DataSource({
  type: 'mysql',
  host: ormconfig.host,
  port: ormconfig.port,
  username: ormconfig.username,
  password: ormconfig.password,
  database: ormconfig.database,
  entities: ormconfig.entities,
  migrations: ormconfig.migrations,
});
