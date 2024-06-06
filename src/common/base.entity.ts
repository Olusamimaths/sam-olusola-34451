import { Type } from 'class-transformer';
import { IsUUID } from 'class-validator';
import {
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export class BaseModel {
  @PrimaryGeneratedColumn('uuid')
  @IsUUID('4')
  id: string;

  @CreateDateColumn({ name: 'created_at' })
  @Type(() => Date)
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  @Type(() => Date)
  updatedAt: Date;
}
