import { NestFactory, Reflector } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { RolesGuard } from './common/guards/roles.guard';
import { AppModule } from './app.module';
import { GlobalExceptionFilter } from './common/filters/global-exception.filter';
import { AppConfigService } from './config';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Get config
  const appConfig = app.get(AppConfigService);

  // Enable global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Remove unknown properties
      forbidNonWhitelisted: true, // Throw on unknown properties
      transform: true, // Auto transform to DTO class
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Enable global exception filter
  app.useGlobalFilters(new GlobalExceptionFilter());

  // Global authorization guard via RolesGuard
  app.useGlobalGuards(new RolesGuard(new Reflector()));

  // Global response wrapper
  app.useGlobalInterceptors(new ResponseInterceptor());

  // Set global API prefix
  app.setGlobalPrefix(appConfig.getFullApiPrefix());

  const port = appConfig.getPort();
  await app.listen(port, '0.0.0.0');
  console.log(`Application running on port ${port}`);
}
bootstrap();
