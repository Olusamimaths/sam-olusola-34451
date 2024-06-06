import * as dotenv from 'dotenv';
dotenv.config();
const ormconfig = {
  type: 'mysql',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [__dirname + '/**/*.model.ts'],
  migrations: ['src/database/migrations/*.ts'],
  synchronize: true, // TODO: Remove this in production
};

export { ormconfig };
