import { BaseService } from '@/common';
import { Inject, Injectable } from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';
import { Tokens } from './entities';
import { InjectRepository } from '@nestjs/typeorm';
import { Activity } from '../activity/entities';

@Injectable()
export class TokensService extends BaseService {
  constructor(
    @InjectRepository(Tokens)
    private readonly _tokenRepository: Repository<Tokens>,
    @Inject(EntityManager)
    private readonly _manager: EntityManager,
  ) {
    super(TokensService.name);
  }

  public async processListings() {
    const now = new Date();

    const expiredListings = await this._getAllExpiredListings(now);
    for (const listing of expiredListings) {
      const tokenExists = await this._getTokenForListing(listing);
      if (!tokenExists) {
        await this._saveNewToken(listing);
      } else {
        await this._handleCheckForLowerListing(listing, now);
      }
    }
  }

  private async _getAllExpiredListings(now: Date) {
    return await this._manager
      .createQueryBuilder(Activity, 'activity')
      .where('activity.listingTo < :now', { now })
      .andWhere('activity.listingTo IS NOT NULL')
      .getMany();
  }

  private async _getTokenForListing(listing: Activity) {
    return await this._manager
      .createQueryBuilder(Tokens, 'tokens')
      .where(
        'tokens.index = :index AND tokens.contract_address = :contractAddress',
        {
          index: listing.tokenIndex,
          contract_address: listing.contractAddress,
        },
      )
      .getOne();
  }

  private async _saveNewToken(listing: Activity) {
    const token: Partial<Tokens> = {
      index: listing.tokenIndex,
      contractAddress: listing.contractAddress,
      currentPrice: null,
    };
    await this._tokenRepository.save(token);
  }

  private async _handleCheckForLowerListing(listing: Activity, now: Date) {
    const lowestListing = await this._findActiveLowerListing(listing, now);
    if (lowestListing) {
      await this._updatePrice({
        listing,
        currentPrice: lowestListing.listingPrice,
      });
    } else {
      await this._updatePrice({
        listing,
        currentPrice: null,
      });
    }
  }

  private async _findActiveLowerListing(listing: Activity, now: Date) {
    return await this._manager
      .createQueryBuilder(Activity, 'activity')
      .where(
        'activity.tokenIndex = :index AND activity.contractAddress = :contractAddress AND activity.listingTo >= :now',
        {
          index: listing.tokenIndex,
          contractAddress: listing.contractAddress,
          now,
        },
      )
      .orderBy('activity.listingPrice', 'ASC')
      .getOne();
  }

  private async _updatePrice({
    listing,
    currentPrice,
  }: {
    listing: Activity;
    currentPrice: bigint;
  }) {
    await this._tokenRepository.update(
      {
        index: listing.tokenIndex,
        contractAddress: listing.contractAddress,
      },
      { currentPrice },
    );
  }
}
