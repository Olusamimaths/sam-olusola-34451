import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DbConfig, validationSchema } from './config';
import { BullModule } from '@nestjs/bull';
import { ActivityModule } from './components/activity/activity.module';
import { APP_FILTER } from '@nestjs/core';
import { AllExceptionsFilter } from '@/utils/filters/exception-filter';
import { TokensModule } from './components/tokens/tokens.module';
import configuration from './config/configuration';
import { ScheduleModule } from '@nestjs/schedule';
import { ActivityQueueModule } from './components/activity-manager/activity-manager.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      validationSchema,
    }),
    BullModule.forRoot({
      redis: {
        host: process.env.REDIS_HOST,
        port: parseInt(process.env.REDIS_PORT),
      },
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: DbConfig.host,
      port: DbConfig.port,
      username: DbConfig.username,
      password: DbConfig.password,
      database: DbConfig.database,
      entities: DbConfig.entities,
      migrations: DbConfig.migrations,
    }),
    ScheduleModule.forRoot(),
    ActivityModule,
    TokensModule,
    ActivityQueueModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
  ],
})
export class AppModule {}
