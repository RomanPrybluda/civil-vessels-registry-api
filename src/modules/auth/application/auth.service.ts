import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from '../api/dto/login.dto';
import { LoginResponseDto } from '../api/dto/login-response.dto';
import { MeResponseDto } from '../api/dto/me-response.dto';
import { JwtPayload } from '../domain/jwt-payload.interface';
import { Role } from '../domain/role.enum';
import { getJwtExpiresIn, getJwtSecret } from './auth.config';

interface LocalAuthUser {
  id: string;
  username: string;
  password: string;
  role: Role;
}

const DEFAULT_USERS: LocalAuthUser[] = [
  {
    id: 'admin-1',
    username: 'admin',
    password: 'admin123',
    role: Role.ADMIN,
  },
  {
    id: 'manager-1',
    username: 'manager',
    password: 'manager123',
    role: Role.MANAGER,
  },
  {
    id: 'user-1',
    username: 'user',
    password: 'user123',
    role: Role.USER,
  },
];

@Injectable()
export class AuthService {
  private readonly users: LocalAuthUser[] = this.loadUsers();

  constructor(private readonly jwtService: JwtService) {}

  async login(dto: LoginDto): Promise<LoginResponseDto> {
    const user = this.users.find(
      (candidate) =>
        candidate.username === dto.username &&
        candidate.password === dto.password,
    );

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload: JwtPayload = {
      sub: user.id,
      username: user.username,
      role: user.role,
    };

    const expiresIn = getJwtExpiresIn();
    const accessToken = await this.jwtService.signAsync(payload, {
      secret: getJwtSecret(),
      expiresIn,
    });

    return {
      accessToken,
      tokenType: 'Bearer',
      expiresIn: String(expiresIn),
      role: user.role,
    };
  }

  me(user: JwtPayload): MeResponseDto {
    return {
      id: user.sub,
      username: user.username,
      role: user.role,
    };
  }

  private loadUsers(): LocalAuthUser[] {
    const rawUsers = process.env.AUTH_USERS_JSON;
    if (!rawUsers) {
      return DEFAULT_USERS;
    }

    try {
      const parsed = JSON.parse(rawUsers) as unknown;
      if (!Array.isArray(parsed)) {
        throw new Error('AUTH_USERS_JSON must be a JSON array');
      }

      return parsed.map((entry, index) => {
        if (!entry || typeof entry !== 'object') {
          throw new Error(`AUTH_USERS_JSON[${index}] must be an object`);
        }

        const candidate = entry as Record<string, unknown>;
        const username = candidate.username;
        const password = candidate.password;
        const role = candidate.role;

        if (
          typeof username !== 'string' ||
          typeof password !== 'string' ||
          typeof role !== 'string'
        ) {
          throw new Error(
            `AUTH_USERS_JSON[${index}] must include string username, password and role`,
          );
        }

        if (!Object.values(Role).includes(role as Role)) {
          throw new Error(
            `AUTH_USERS_JSON[${index}] has unsupported role: ${role}`,
          );
        }

        return {
          id:
            typeof candidate.id === 'string' && candidate.id.length > 0
              ? candidate.id
              : `${username}-id`,
          username,
          password,
          role: role as Role,
        };
      });
    } catch (error: unknown) {
      console.error(
        'Invalid AUTH_USERS_JSON configuration. Falling back to default local users.',
        error,
      );
      return DEFAULT_USERS;
    }
  }
}
