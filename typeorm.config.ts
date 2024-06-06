import { DataSource } from 'typeorm';
import configuration from 'src/config/configuration';

const { database: databaseConfig } = configuration();

export default new DataSource({
  type: 'mysql',
  host: databaseConfig.host,
  port: databaseConfig.port,
  username: databaseConfig.username,
  password: databaseConfig.password,
  database: databaseConfig.name,
  entities: databaseConfig.entities,
  migrations: databaseConfig.migrations,
});
