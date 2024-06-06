import { Module } from '@nestjs/common';
import { ActivityService } from './activity.service';
import { HttpModule } from '@/utils/http-service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Activity } from './entities';
import { ActivityController } from './activity.controller';

@Module({
  imports: [HttpModule, TypeOrmModule.forFeature([Activity])],
  providers: [ActivityService],
  controllers: [ActivityController],
})
export class ActivityModule {}
