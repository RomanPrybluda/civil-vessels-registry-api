import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from '../src/app.module';

type HttpHandler = (req: unknown, res: unknown) => unknown;

let cachedHandler: HttpHandler | null = null;

async function bootstrap(): Promise<HttpHandler> {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

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

  await app.init();
  return app.getHttpAdapter().getInstance() as HttpHandler;
}

export default async function handler(req: unknown, res: unknown) {
  if (!cachedHandler) {
    cachedHandler = await bootstrap();
  }

  return cachedHandler(req, res);
}
