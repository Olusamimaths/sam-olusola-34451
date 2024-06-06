import { BaseService } from '@/common';
import { HttpService } from '@/utils/http-service';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Activity } from './entities';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { EventsResponse } from './types';
import { IHttpResponse } from '@/utils/http-service/types';

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
    const response = await this._fetchEventsFromReservoir();

    this._handleFetchEventsFailed(response);
    const eventsResponse = response.data as EventsResponse;
    await this._generateActivitiesAndSave(eventsResponse);

    const { continuation } = eventsResponse;
    return { continuation };
  }

  private async _generateActivitiesAndSave(eventsResponse: EventsResponse) {
    const activities: Activity[] = await this._getActivitiesFromEvents(
      eventsResponse,
    );
    await this._activityRepository.save(activities);
  }

  private async _getActivitiesFromEvents(
    eventResponse: EventsResponse,
  ): Promise<Activity[]> {
    const activities: Activity[] = [];
    const { events } = eventResponse;

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
    return activities;
  }

  private _handleFetchEventsFailed(response: IHttpResponse<any>) {
    if (response.status !== 200) {
      this.logger.error(response.message);
      throw new Error('Failed to fetch events');
    }
  }

  private async _fetchEventsFromReservoir(): Promise<IHttpResponse> {
    const url = this._configService.get<string>('reservoirApiEndpoint');
    const urlWithLimit = `${url}/events/asks/v3?limit=1000`;
    const response = await this._httpService.get(urlWithLimit);
    return response;
  }
}
