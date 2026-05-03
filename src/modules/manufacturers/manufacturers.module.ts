import { Module } from '@nestjs/common';
import { ManufacturersController } from './api/manufacturers.controller';
import { ManufacturersService } from './application/manufacturers.service';
import { ManufacturersRepository } from './infrastructure/manufacturers.repository';

@Module({
  controllers: [ManufacturersController],
  providers: [ManufacturersService, ManufacturersRepository],
})
export class ManufacturersModule {}
