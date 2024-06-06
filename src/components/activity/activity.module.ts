import { Module } from '@nestjs/common';
import { ActivityService } from './activity.service';
import { HttpModule } from '@/utils/http-service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Activity } from './entities';

@Module({
  imports: [HttpModule, TypeOrmModule.forFeature([Activity])],
  providers: [ActivityService],
})
export class ActivityModule {}
