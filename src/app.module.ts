import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './database/prisma.module';
import { HealthController } from './health.controller';
import { ClassificationSocietiesModule } from './modules/classification-societies/classification-societies.module';
import { ManufacturersModule } from './modules/manufacturers/manufacturers.module';

@Module({
  imports: [PrismaModule, ClassificationSocietiesModule, ManufacturersModule],
  controllers: [AppController, HealthController],
  providers: [AppService],
})
export class AppModule {}
