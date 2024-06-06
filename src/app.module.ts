import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ormconfig } from './config/db.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: ormconfig.host,
      port: ormconfig.port,
      username: ormconfig.username,
      password: ormconfig.password,
      database: ormconfig.database,
      entities: ormconfig.entities,
      migrations: ormconfig.migrations,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
