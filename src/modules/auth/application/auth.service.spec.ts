import { ServiceUnavailableException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  const originalAuthUsersJson = process.env.AUTH_USERS_JSON;

  const jwtServiceMock = {
    signAsync: jest.fn<Promise<string>, unknown[]>(),
  } as unknown as JwtService;

  afterEach(() => {
    if (originalAuthUsersJson === undefined) {
      delete process.env.AUTH_USERS_JSON;
    } else {
      process.env.AUTH_USERS_JSON = originalAuthUsersJson;
    }
    jest.clearAllMocks();
  });

  it('does not fail during construction when AUTH_USERS_JSON is missing', () => {
    delete process.env.AUTH_USERS_JSON;
    expect(() => new AuthService(jwtServiceMock)).not.toThrow();
  });

  it('returns service unavailable on login when AUTH_USERS_JSON is missing', async () => {
    delete process.env.AUTH_USERS_JSON;
    const service = new AuthService(jwtServiceMock);

    await expect(
      service.login({
        username: 'admin',
        password: 'admin-pass',
      }),
    ).rejects.toBeInstanceOf(ServiceUnavailableException);
  });

  it('returns unauthorized when credentials are invalid', async () => {
    process.env.AUTH_USERS_JSON = JSON.stringify([
      {
        id: 'admin-1',
        username: 'admin',
        password: 'admin-pass',
        role: 'admin',
      },
    ]);

    const service = new AuthService(jwtServiceMock);

    await expect(
      service.login({
        username: 'admin',
        password: 'wrong-pass',
      }),
    ).rejects.toBeInstanceOf(UnauthorizedException);
  });
});
