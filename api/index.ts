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
        .addBearerAuth(
          {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
          },
          'access-token',
        )
        .addTag('health')
        .addTag('auth')
        .addTag('vessels')
        .addTag('manufacturers')
        .addTag('classification-societies')
        .build();

      const document = SwaggerModule.createDocument(app, config);
      SwaggerModule.setup('api/docs', app, document, {
        useGlobalPrefix: false,
        jsonDocumentUrl: 'api/docs-json',
      });

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

export default async function handler(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const app = await bootstrap();
    app(req, res);
    return;
  } catch (error: unknown) {
    const stack =
      error instanceof Error ? error.stack : JSON.stringify(error, null, 2);
    console.error('Serverless bootstrap failed', stack);
    res.status(500).json({
      statusCode: 500,
      message: 'Internal server error',
    });
    return;
  }
}
