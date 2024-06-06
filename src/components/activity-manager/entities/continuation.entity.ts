import { BaseEntity } from '@/common';
import { Column, Entity } from 'typeorm';
import { ContinuationKey } from '../types/continuation.key';

@Entity({ name: 'continuation_reserve' })
export class ContinuationEntity extends BaseEntity {
  @Column({ name: 'continuation', type: 'text', nullable: true })
  continuation: string;

  @Column({
    unique: true,
    name: ContinuationKey.KEY,
  })
  key: string;
}
