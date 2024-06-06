import { BaseService } from '@/common';
import { InjectQueue } from '@nestjs/bull';
import { Inject, Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Queue } from 'bull';
import { ActivityQueues } from './enums';
import { ActivityService } from '../activity/activity.service';
import { EntityManager } from 'typeorm';

@Injectable()
export class EventPollService extends BaseService {
  constructor(
    @InjectQueue(ActivityQueues.ACTIVITY_QUEUE)
    private activityQueue: Queue,
    private readonly activityService: ActivityService,
    @Inject(EntityManager)
    private readonly _manager: EntityManager,
  ) {
    super(EventPollService.name);
  }

  @Cron(CronExpression.EVERY_5_SECONDS) // SET to run as often as needed
  async fetchEvents() {
    this.logger.log('Fetching events');
    await this.activityService.fetchEvents();
  }
}
