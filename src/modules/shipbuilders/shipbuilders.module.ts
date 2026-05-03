import { Module } from '@nestjs/common';
import { ShipbuildersController } from './api/shipbuilders.controller';
import { ShipbuildersService } from './application/shipbuilders.service';
import { ShipbuildersRepository } from './infrastructure/shipbuilders.repository';

@Module({
  controllers: [ShipbuildersController],
  providers: [ShipbuildersService, ShipbuildersRepository],
})
export class ShipbuildersModule {}
