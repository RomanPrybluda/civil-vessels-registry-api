import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import express, { Request, Response } from 'express';
import { AppModule } from '../src/app.module';

const server = express();
let bootstrapPromise: Promise<typeof server> | null = null;

async function bootstrap() {
  if (!bootstrapPromise) {
    bootstrapPromise = (async () => {
      const app = await NestFactory.create(
        AppModule,
        new ExpressAdapter(server),
      );

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

      app.setGlobalPrefix('');

      await app.init();
      return server;
    })().catch((error: unknown) => {
      bootstrapPromise = null;
      throw error;
    });
  }

  return bootstrapPromise;
}

export default async function handler(req: Request, res: Response) {
  try {
    const app = await bootstrap();
    return app(req, res);
  } catch (error: unknown) {
    console.error('Serverless bootstrap failed', error);
    return res.status(500).json({
      statusCode: 500,
      message: 'Internal server error',
    });
  }
}
