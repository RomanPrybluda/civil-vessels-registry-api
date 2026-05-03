import {
  Controller,
  Get,
  ServiceUnavailableException,
} from '@nestjs/common';
import {
  ApiOkResponse,
  ApiOperation,
  ApiServiceUnavailableResponse,
  ApiTags,
} from '@nestjs/swagger';
import { PrismaService } from './database/prisma.service';

type HealthStatus = 'ok';
type DependencyStatus = 'up';
type HealthResponse = {
  status: HealthStatus;
  timestamp: string;
  checks: {
    database: DependencyStatus;
  };
};

@ApiTags('health')
@Controller('health')
export class HealthController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  @ApiOperation({
    summary: 'Check API and database health status',
  })
  @ApiOkResponse({
    description: 'API and database are available',
    schema: {
      example: {
        status: 'ok',
        timestamp: '2026-05-03T10:30:00.000Z',
        checks: {
          database: 'up',
        },
      },
    },
  })
  @ApiServiceUnavailableResponse({
    description: 'Database is unavailable',
    schema: {
      example: {
        status: 'error',
        timestamp: '2026-05-03T10:30:00.000Z',
        checks: {
          database: 'down',
        },
      },
    },
  })
  async getHealth(): Promise<HealthResponse> {
    const timestamp = new Date().toISOString();

    try {
      await this.prisma.$queryRaw`SELECT 1`;

      return {
        status: 'ok',
        timestamp,
        checks: {
          database: 'up',
        },
      };
    } catch {
      throw new ServiceUnavailableException({
        status: 'error',
        timestamp,
        checks: {
          database: 'down',
        },
      });
    }
  }
}
