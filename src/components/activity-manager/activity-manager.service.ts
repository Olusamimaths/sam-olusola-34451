import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';
import { ActivityQueues } from './enums';
import { BaseService } from '@/common';
import { EventsResponse } from '../activity/types';

@Injectable()
export class ActivityQueueService extends BaseService {
  constructor(
    @InjectQueue(ActivityQueues.ACTIVITY_QUEUE)
    private readonly activityQueue: Queue,
  ) {
    super(ActivityQueueService.name);
  }

  async addToQueue(body: EventsResponse) {
    await this.activityQueue.add(ActivityQueues.FETCH_EVENTS, body, {
      attempts: 3,
    });
  }
}
