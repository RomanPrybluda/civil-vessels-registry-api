import { Module } from '@nestjs/common';
import { VesselsController } from './api/vessels.controller';
import { VesselsService } from './application/vessels.service';
import { VesselsRepository } from './infrastructure/vessels.repository';

@Module({
  controllers: [VesselsController],
  providers: [VesselsService, VesselsRepository],
})
export class VesselsModule {}
