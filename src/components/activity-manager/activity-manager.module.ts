import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { ActivityQueues } from './enums';
import { ActivityQueueProcessor } from './activity-manager.processor';
import { ActivityQueueService } from './activity-manager.service';
import { ActivityModule } from '../activity/activity.module';
import { EventPollService } from './event-poll.service';

@Module({
  imports: [
    ActivityModule,
    BullModule.registerQueue({
      name: ActivityQueues.ACTIVITY_QUEUE,
    }),
  ],
  providers: [ActivityQueueService, ActivityQueueProcessor, EventPollService],
  exports: [ActivityQueueService],
})
export class ActivityQueueModule {}
