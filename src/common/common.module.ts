import { Module } from '@nestjs/common';
import { LoggerService } from './logger/logger.service';
import { HealthController } from './controllers/health.controller';
import { AppConfigService } from '../config/app-config.service';

@Module({
  controllers: [HealthController],
  providers: [LoggerService, AppConfigService],
  exports: [LoggerService, AppConfigService],
})
export class CommonModule {}
