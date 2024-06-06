import { BaseEntity } from '@/common';
import { MaxLength } from 'class-validator';
import { Column, Entity } from 'typeorm';

@Entity({ name: 'tokens' })
export class Tokens extends BaseEntity {
  @MaxLength(42)
  @Column({
    name: 'contract_address',
    type: 'varchar',
    length: 42,
    nullable: false,
  })
  contractAddress: string;

  @Column({ name: 'index', type: 'text', nullable: false })
  index: string;

  @Column({
    name: 'listing_price',
    type: 'decimal',
    precision: 36,
    scale: 18,
    nullable: false,
  })
  currentPrice: bigint;
}
