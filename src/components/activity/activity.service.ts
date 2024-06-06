import { BaseService } from '@/common';
import { HttpService } from '@/utils/http-service';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Activity } from './entities';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { EventsResponse } from './types';

@Injectable()
export class ActivityService extends BaseService {
  constructor(
    private readonly _httpService: HttpService,
    @InjectRepository(Activity)
    private readonly _activityRepository: Repository<Activity>,
    private readonly _configService: ConfigService,
  ) {
    super(ActivityService.name);
  }

  public async fetchEvents() {
    const url = this._configService.get<string>('reservoirApiEndpoint');
    const urlWithLimit = `${url}/events/asks/v3?limit=1000`;
    const response = await this._httpService.get(urlWithLimit);

    if (response.status !== 200) {
      this.logger.error(response.message);
      throw new Error('Failed to fetch events');
    }

    const { events, continuation } = response.data as EventsResponse;

    const activities: Activity[] = [];
    for (const event of events) {
      if (event.event.kind !== 'new-order') {
        continue;
      }

      const activity: Partial<Activity> = {
        contractAddress: event.order.contract,
        tokenIndex: event.order.criteria.data.token.tokenId,
        listingPrice: event.order.price.amount.native,
        marker: event.order.maker,
        listingFrom: event.order.validFrom,
        listingTo: event.order.validUntil,
        eventTimestamp: new Date(event.event.createdAt),
      };

      activities.push(activity as Activity);
    }
    await this._activityRepository.save(activities);
    return { continuation };
  }
}
