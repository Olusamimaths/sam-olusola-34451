import { BaseService } from '@/common';
import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ActivityService } from '../activity/activity.service';

@Injectable()
export class EventPollService extends BaseService {
  constructor(private readonly activityService: ActivityService) {
    super(EventPollService.name);
  }

  // @Cron(CronExpression.EVERY_5_SECONDS) // For testing
  @Cron(CronExpression.EVERY_10_MINUTES) // SET to run as often as needed
  async fetchEvents() {
    this.logger.log('Fetching events');
    await this.activityService.fetchEvents();
  }
}
