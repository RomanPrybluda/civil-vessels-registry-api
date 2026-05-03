import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';
import { PrismaService } from './../src/database/prisma.service';

describe('HealthController (e2e)', () => {
  let app: INestApplication<App>;
  let databaseUp = true;
  const previousAuthUsers = process.env.AUTH_USERS_JSON;

  beforeAll(() => {
    process.env.AUTH_USERS_JSON = JSON.stringify([
      {
        id: 'e2e-user-1',
        username: 'e2e-user',
        password: 'e2e-password',
        role: 'user',
      },
    ]);
  });

  beforeEach(async () => {
    databaseUp = true;

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(PrismaService)
      .useValue({
        $queryRaw: jest.fn().mockImplementation(async () => {
          if (!databaseUp) {
            throw new Error('Database unavailable');
          }

          return [{ '?column?': 1 }];
        }),
      })
      .compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api');
    await app.init();
  });

  it('/api/health (GET) returns 200 when DB is reachable', () => {
    return request(app.getHttpServer())
      .get('/api/health')
      .expect(200)
      .expect((response) => {
        expect(response.body.status).toBe('ok');
        expect(typeof response.body.timestamp).toBe('string');
        expect(response.body.checks).toEqual({ database: 'up' });
      });
  });

  it('/api/health (GET) returns 503 when DB is unreachable', () => {
    databaseUp = false;

    return request(app.getHttpServer())
      .get('/api/health')
      .expect(503)
      .expect((response) => {
        expect(response.body.status).toBe('error');
        expect(typeof response.body.timestamp).toBe('string');
        expect(response.body.checks).toEqual({ database: 'down' });
      });
  });

  afterEach(async () => {
    if (app) {
      await app.close();
    }
  });

  afterAll(() => {
    if (previousAuthUsers === undefined) {
      delete process.env.AUTH_USERS_JSON;
      return;
    }

    process.env.AUTH_USERS_JSON = previousAuthUsers;
  });
});
