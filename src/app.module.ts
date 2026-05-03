import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './database/prisma.module';
import { HealthController } from './health.controller';
import { AuthModule } from './modules/auth/auth.module';
import { ClassificationSocietiesModule } from './modules/classification-societies/classification-societies.module';
import { ManufacturersModule } from './modules/manufacturers/manufacturers.module';
import { VesselsModule } from './modules/vessels/vessels.module';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    ClassificationSocietiesModule,
    ManufacturersModule,
    VesselsModule,
  ],
  controllers: [AppController, HealthController],
  providers: [AppService],
})
export class AppModule {}
