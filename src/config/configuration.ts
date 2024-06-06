import * as dotenv from 'dotenv';
dotenv.config();
export default () => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  database: {
    type: 'mysql',
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT, 10) || 3306,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    name: process.env.DB_NAME,
    entities: [__dirname + '/**/*.model.ts'],
    migrations: ['src/database/migrations/*.ts'],
    synchronize: true,
  },
});
