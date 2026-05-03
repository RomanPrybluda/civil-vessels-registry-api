import { Module } from '@nestjs/common';
import { ClassificationSocietiesController } from './api/classification-societies.controller';
import { ClassificationSocietiesService } from './application/classification-societies.service';
import { ClassificationSocietiesRepository } from './infrastructure/classification-societies.repository';

@Module({
  controllers: [ClassificationSocietiesController],
  providers: [
    ClassificationSocietiesService,
    ClassificationSocietiesRepository,
  ],
})
export class ClassificationSocietiesModule {}
