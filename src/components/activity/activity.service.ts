import { BaseService } from '@/common';
import { HttpService } from '@/utils/http-service';
import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Activity } from './entities';
import { DataSource, EntityManager, Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { EventsResponse } from './types';
import { IHttpResponse } from '@/utils/http-service/types';
import { ContinuationEntity } from '../activity-manager/entities';
import { ContinuationKey } from '../activity-manager/types/continuation.key';
import { InjectQueue } from '@nestjs/bull';
import { ActivityQueues } from '../activity-manager/enums';
import { Queue } from 'bull';

@Injectable()
export class ActivityService extends BaseService {
  constructor(
    private readonly _httpService: HttpService,
    private readonly _configService: ConfigService,
    private readonly _dataSource: DataSource,

    @Inject(EntityManager)
    private readonly _manager: EntityManager,
    @InjectQueue(ActivityQueues.ACTIVITY_QUEUE)
    private readonly _activityQueue: Queue,
  ) {
    super(ActivityService.name);
  }

  public async fetchEvents(): Promise<void> {
    const response = await this._fetchEventsFromReservoir();
    this._handleFetchEventsFailed(response);
    const eventsResponse = response.data as EventsResponse;
    await this._activityQueue.add(ActivityQueues.FETCH_EVENTS, eventsResponse, {
      attempts: 3,
    });
  }

  private _handleFetchEventsFailed(response: IHttpResponse<any>) {
    if (response.status !== 200) {
      this.logger.error(response.message);
      throw new Error('Failed to fetch events');
    }
  }

  public async generateActivitiesFromEventsAndSave(
    eventsResponse: EventsResponse,
  ) {
    const activities: Activity[] = await this._getActivitiesFromEvents(
      eventsResponse,
    );
    await this._processActivities({ activities, eventsResponse });
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

  private async _processActivities({
    activities,
    eventsResponse,
  }: {
    activities: Activity[];
    eventsResponse: EventsResponse;
  }) {
    const queryRunner = this._dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    const manager = queryRunner.manager;
    try {
      await manager.save(Activity, activities);

      /**
       * Update the continuation entity with the latest continuation
       * so that we can fetch the next set of events
       * when the cron job runs next
       * We can only have one continuation entity in the database at a time
       */
      await manager.update(
        ContinuationEntity,
        { key: ContinuationKey.KEY },
        { continuation: eventsResponse.continuation },
      );
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.logger.error(error);
      throw new BadRequestException('Failed to save activities');
    } finally {
      await queryRunner.release();
    }
  }

  private async _fetchEventsFromReservoir(): Promise<IHttpResponse> {
    const { urlWithLimit, cont } =
      await this._getReservoirUrlAndCurrentContinuationEntity();

    const response: IHttpResponse<EventsResponse> = await this._httpService.get(
      urlWithLimit,
    );
    const { data } = response;
    if (data.continuation) {
      await this._upsertContinuationEntity(cont, data);
    }
    return response;
  }

  private async _getReservoirUrlAndCurrentContinuationEntity() {
    const url = this._configService.get<string>('reservoirApiEndpoint');
    const urlWithLimit = `${url}/events/asks/v3?limit=1000`;

    const cont = await this._manager.findOne(ContinuationEntity, {
      where: { key: ContinuationKey.KEY },
    });

    const continuation = cont?.continuation;
    if (continuation) {
      urlWithLimit.concat(`&continuation=${continuation}`);
    }
    return { urlWithLimit, cont };
  }

  private async _upsertContinuationEntity(
    cont: ContinuationEntity,
    data: EventsResponse,
  ) {
    if (!cont) {
      const newCont = new ContinuationEntity();
      newCont.continuation = data.continuation;
      newCont.key = ContinuationKey.KEY;
      await this._manager.save(newCont);
    } else {
      await this._manager.update(
        ContinuationEntity,
        { key: ContinuationKey.KEY },
        { continuation: data.continuation },
      );
    }
  }
}
