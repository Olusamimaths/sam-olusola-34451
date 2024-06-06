import { BaseEntity } from '@/common';
import { MaxLength } from 'class-validator';
import { Column, Entity } from 'typeorm';

@Entity({ name: 'activity' })
export class Activity extends BaseEntity {
  @MaxLength(42)
  @Column({
    name: 'contract_address',
    type: 'varchar',
    length: 42,
    nullable: false,
  })
  contractAddress: string;

  @Column({ name: 'token_index', type: 'text', nullable: false })
  tokenIndex: string;

  @Column({
    name: 'listing_price',
    type: 'decimal',
    precision: 36,
    scale: 18,
    nullable: false,
  })
  listingPrice: bigint;

  @Column({
    name: 'marker',
    type: 'varchar',
    length: 42,
    nullable: false,
  })
  marker: string;

  @Column({
    name: 'listing_from',
    type: 'bigint',
    nullable: false,
  })
  listingFrom: bigint;

  @Column({
    name: 'listing_to',
    type: 'bigint',
    nullable: true,
  })
  listingTo: bigint;

  @Column({
    name: 'event_timestamp',
    type: 'datetime',
    nullable: false,
  })
  eventTimestamp: Date;
}
