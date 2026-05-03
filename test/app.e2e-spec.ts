import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';

describe('HealthController (e2e)', () => {
  let app: INestApplication<App>;
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
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api');
    await app.init();
  });

  it('/api/health (GET)', () => {
    return request(app.getHttpServer())
      .get('/api/health')
      .expect(200)
      .expect((response) => {
        expect(response.body.status).toBe('ok');
        expect(typeof response.body.timestamp).toBe('string');
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
