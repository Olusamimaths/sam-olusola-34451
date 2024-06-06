import { Module } from '@nestjs/common';
import { ActivityService } from './activity.service';
import { HttpModule } from '@/utils/http-service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Activity } from './entities';
import { ActivityController } from './activity.controller';
import { BullModule } from '@nestjs/bull';
import { ActivityQueues } from '../activity-manager/enums';

@Module({
  imports: [
    HttpModule,
    TypeOrmModule.forFeature([Activity]),
    BullModule.registerQueue({
      name: ActivityQueues.ACTIVITY_QUEUE,
    }),
  ],
  providers: [ActivityService],
  controllers: [ActivityController],
  exports: [ActivityService],
})
export class ActivityModule {}
