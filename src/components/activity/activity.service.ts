import { BaseService } from '@/common';
import { HttpService } from '@/utils/http-service';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Activity } from './entities';
import { Repository } from 'typeorm';

@Injectable()
export class ActivityService extends BaseService {
  constructor(
    private readonly httpService: HttpService,
    @InjectRepository(Activity)
    private readonly activityRepository: Repository<Activity>,
  ) {
    super(ActivityService.name);
  }
}
