import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Civil Vessels Registry API')
    .setDescription('Backend Web API for civil cargo vessels registry')
    .setVersion('1.0')
    .addTag('health')
    .addTag('vessels')
    .addTag('manufacturers')
    .addTag('classification-societies')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
