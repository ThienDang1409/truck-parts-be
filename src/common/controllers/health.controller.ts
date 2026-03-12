import { Controller, Get } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

interface HealthCheckResponse {
  status: 'ok' | 'error';
  timestamp: string;
  uptime: number;
  database: 'ok' | 'error';
  message?: string;
}

@Controller('health')
export class HealthController {
  constructor(private prisma: PrismaService) {}

  @Get()
  async check(): Promise<HealthCheckResponse> {
    const startTime = process.uptime();

    try {
      // Check database connection
      await this.prisma.$queryRaw`SELECT 1`;

      return {
        status: 'ok',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        database: 'ok',
      };
    } catch (error) {
      return {
        status: 'error',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        database: 'error',
        message: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }
}
