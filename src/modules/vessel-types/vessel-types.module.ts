import { Module } from '@nestjs/common';
import { VesselTypesController } from './api/vessel-types.controller';
import { VesselTypesService } from './application/vessel-types.service';
import { VesselTypesRepository } from './infrastructure/vessel-types.repository';

@Module({
  controllers: [VesselTypesController],
  providers: [VesselTypesService, VesselTypesRepository],
})
export class VesselTypesModule {}
