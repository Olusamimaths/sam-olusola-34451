import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { ActivityQueues } from './enums';
import { BaseService } from '@/common';
import { ActivityService } from '../activity/activity.service';
import { EventsResponse } from '../activity/types';

@Processor(ActivityQueues.ACTIVITY_QUEUE)
export class ActivityQueueProcessor extends BaseService {
  constructor(private readonly _activityService: ActivityService) {
    super(ActivityQueueProcessor.name);
  }

  @Process(ActivityQueues.FETCH_EVENTS)
  async processEvents(job: Job<unknown> & { data: EventsResponse }) {
    return await this.process(job.data);
  }

  private async process(body: EventsResponse) {
    this.logger.log(`Processing events from ${body.continuation}`);
    return await this._activityService.generateActivitiesFromEventsAndSave(
      body,
    );
  }
}
