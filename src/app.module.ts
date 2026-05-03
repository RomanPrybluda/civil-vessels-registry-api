import { Module } from '@nestjs/common';
import { PrismaModule } from './database/prisma.module';
import { HealthController } from './health.controller';
import { AuthModule } from './modules/auth/auth.module';
import { ClassificationSocietiesModule } from './modules/classification-societies/classification-societies.module';
import { ManufacturersModule } from './modules/manufacturers/manufacturers.module';
import { ShipbuildersModule } from './modules/shipbuilders/shipbuilders.module';
import { VesselsModule } from './modules/vessels/vessels.module';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    ClassificationSocietiesModule,
    ManufacturersModule,
    ShipbuildersModule,
    VesselsModule,
  ],
  controllers: [HealthController],
})
export class AppModule {}
