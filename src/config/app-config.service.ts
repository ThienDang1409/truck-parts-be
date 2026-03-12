import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppConfigService {
  constructor(private configService: ConfigService) {}

  // Server
  getPort(): number {
    return this.configService.get<number>('PORT', 3000);
  }

  getNodeEnv(): string {
    return this.configService.get<string>('NODE_ENV', 'development');
  }

  isDevelopment(): boolean {
    return this.getNodeEnv() === 'development';
  }

  isProduction(): boolean {
    return this.getNodeEnv() === 'production';
  }

  // Database
  getDatabaseUrl(): string {
    return this.configService.get<string>('DATABASE_URL', '');
  }

  // Auth
  getJwtSecret(): string {
    return this.configService.get<string>('JWT_SECRET', '');
  }

  getJwtExpiration(): string {
    return this.configService.get<string>('JWT_EXPIRATION', '24h');
  }

  // Logging
  getLogLevel(): string {
    return this.configService.get<string>('LOG_LEVEL', 'log');
  }

  // Cache
  getRedisHost(): string {
    return this.configService.get<string>('REDIS_HOST', 'localhost');
  }

  getRedisPort(): number {
    return this.configService.get<number>('REDIS_PORT', 6379);
  }

  getRedisUrl(): string {
    return `redis://${this.getRedisHost()}:${this.getRedisPort()}`;
  }

  // API
  getApiPrefix(): string {
    return this.configService.get<string>('API_PREFIX', 'api');
  }

  getApiVersion(): string {
    return this.configService.get<string>('API_VERSION', 'v1');
  }

  getFullApiPrefix(): string {
    return `${this.getApiPrefix()}/${this.getApiVersion()}`;
  }
}
