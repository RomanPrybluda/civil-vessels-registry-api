import type { SignOptions } from 'jsonwebtoken';

export const DEFAULT_JWT_SECRET = 'change-this-jwt-secret';
export const DEFAULT_JWT_EXPIRES_IN: SignOptions['expiresIn'] = '1h';

export function getJwtSecret(): string {
  return process.env.JWT_SECRET ?? DEFAULT_JWT_SECRET;
}

export function getJwtExpiresIn(): SignOptions['expiresIn'] {
  return (
    (process.env.JWT_EXPIRES_IN as SignOptions['expiresIn'] | undefined) ??
    DEFAULT_JWT_EXPIRES_IN
  );
}
