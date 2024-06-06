import { Controller, Get } from '@nestjs/common';
import { ActivityService } from './activity.service';

@Controller('activity')
export class ActivityController {
  constructor(private service: ActivityService) {}

  @Get()
  getHello() {
    return this.service.fetchEvents();
  }
}
