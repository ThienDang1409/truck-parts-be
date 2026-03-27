---
name: nestjs-prisma-enterprise
description: Khởi tạo hoặc tổ chức lại một backend NestJS với PostgreSQL + Prisma theo chuẩn enterprise.
---
---

## 1. TECH STACK CHUẨN

| Layer | Công nghệ |
|---|---|
| Framework | NestJS (v10+) |
| ORM | **Prisma** |
| Database | PostgreSQL 15+ |
| Validation | class-validator + class-transformer |
| Auth | Passport.js + JWT |
| Config | @nestjs/config + Joi |
| Docs | Swagger (@nestjs/swagger) |
| Test | Jest + Supertest |
| Queue (tùy chọn) | BullMQ + Redis |
| Cache (tùy chọn) | Redis (@nestjs/cache-manager) |

---

## 2. CẤU TRÚC THƯ MỤC

```
project-root/
├── src/
│   ├── app.module.ts
│   ├── main.ts
│   │
│   ├── config/
│   │   └── configuration.ts
│   │
│   ├── prisma/                         # Prisma service (global)
│   │   ├── prisma.module.ts
│   │   └── prisma.service.ts
│   │
│   ├── common/
│   │   ├── decorators/
│   │   │   ├── current-user.decorator.ts
│   │   │   └── roles.decorator.ts
│   │   ├── filters/
│   │   │   └── http-exception.filter.ts
│   │   ├── guards/
│   │   │   ├── jwt-auth.guard.ts
│   │   │   └── roles.guard.ts
│   │   ├── interceptors/
│   │   │   ├── response.interceptor.ts
│   │   │   └── logging.interceptor.ts
│   │   ├── middleware/                  # ← MIDDLEWARE ở đây
│   │   │   ├── logger.middleware.ts
│   │   │   ├── correlation-id.middleware.ts
│   │   │   └── request-context.middleware.ts
│   │   ├── pipes/
│   │   │   └── parse-uuid.pipe.ts
│   │   └── dto/
│   │       └── pagination.dto.ts
│   │
│   └── modules/
│       ├── auth/
│       │   ├── auth.module.ts
│       │   ├── auth.controller.ts
│       │   ├── auth.service.ts
│       │   ├── strategies/
│       │   │   ├── jwt.strategy.ts
│       │   │   └── local.strategy.ts
│       │   └── dto/
│       │       ├── login.dto.ts
│       │       └── register.dto.ts
│       │
│       └── users/
│           ├── users.module.ts
│           ├── users.controller.ts
│           ├── users.service.ts
│           └── dto/
│               ├── create-user.dto.ts
│               └── update-user.dto.ts
│
├── prisma/
│   ├── schema.prisma               # Schema chính
│   ├── seed.ts                     # Seed data
│   └── migrations/                 # Auto-generated
│
├── test/
├── .env
├── .env.example
├── docker-compose.yml
├── Dockerfile
└── package.json
```

---

## 3. PRISMA SETUP

### schema.prisma
```prisma
// prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

enum Role {
  ADMIN
  USER
}

model User {
  id        String    @id @default(uuid())
  email     String    @unique
  firstName String
  lastName  String
  password  String
  role      Role      @default(USER)
  isActive  Boolean   @default(true)
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt
  deletedAt DateTime? // Soft delete

  @@index([email])
  @@map("users")
}
```

### PrismaService
```typescript
// src/prisma/prisma.service.ts
import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);

  constructor() {
    super({
      log: [
        { emit: 'event', level: 'query' },
        { emit: 'stdout', level: 'error' },
        { emit: 'stdout', level: 'warn' },
      ],
    });
  }

  async onModuleInit() {
    await this.$connect();
    this.logger.log('Database connected');

    // Log slow queries (> 200ms) in development
    if (process.env.NODE_ENV === 'development') {
      (this as any).$on('query', (e: any) => {
        if (e.duration > 200) {
          this.logger.warn(`Slow query (${e.duration}ms): ${e.query}`);
        }
      });
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
```

### PrismaModule (global)
```typescript
// src/prisma/prisma.module.ts
import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global()  // Inject PrismaService ở bất kỳ đâu mà không cần import module
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
```

---

## 4. MIDDLEWARE — ĐẦY ĐỦ

> NestJS Middleware chạy **trước** Guards → Interceptors → Pipes → Controller.
> Dùng cho: logging, inject request-id, rate limit thô, parse custom header...

### Vị trí trong Request Lifecycle
```
Request
  │
  ▼
[MIDDLEWARE]          ← đăng ký trong AppModule.configure()
  │
  ▼
[GUARDS]              ← @UseGuards() hoặc Global
  │
  ▼
[INTERCEPTORS - pre]  ← @UseInterceptors() hoặc Global
  │
  ▼
[PIPES]               ← @UsePipes() hoặc Global
  │
  ▼
[CONTROLLER / ROUTE HANDLER]
  │
  ▼
[INTERCEPTORS - post] ← wrap response
  │
  ▼
[EXCEPTION FILTER]    ← nếu có lỗi
```

---

### 4.1 Logger Middleware

```typescript
// src/common/middleware/logger.middleware.ts
import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private readonly logger = new Logger('HTTP');

  use(req: Request, res: Response, next: NextFunction) {
    const { method, originalUrl, ip } = req;
    const userAgent = req.get('user-agent') || '';
    const start = Date.now();

    res.on('finish', () => {
      const duration = Date.now() - start;
      const { statusCode } = res;
      const correlationId = req.headers['x-correlation-id'] || '-';

      this.logger.log(
        `[${correlationId}] ${method} ${originalUrl} ${statusCode} ${duration}ms — ${ip} ${userAgent}`,
      );
    });

    next();
  }
}
```

---

### 4.2 Correlation ID Middleware

```typescript
// src/common/middleware/correlation-id.middleware.ts
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';

// Gắn x-correlation-id vào mỗi request để trace log end-to-end
@Injectable()
export class CorrelationIdMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const correlationId = (req.headers['x-correlation-id'] as string) || uuidv4();
    req.headers['x-correlation-id'] = correlationId;
    res.setHeader('x-correlation-id', correlationId); // Trả về client
    next();
  }
}
```

---

### 4.3 Request Context Middleware (AsyncLocalStorage)

```typescript
// src/common/middleware/request-context.middleware.ts
// Dùng khi cần truy cập thông tin request sâu bên trong service
// mà không cần truyền tay qua từng tham số
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { AsyncLocalStorage } from 'async_hooks';

export interface RequestContext {
  correlationId: string;
  userId?: string;
  ip: string;
}

export const requestContextStorage = new AsyncLocalStorage<RequestContext>();

@Injectable()
export class RequestContextMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const context: RequestContext = {
      correlationId: req.headers['x-correlation-id'] as string,
      ip: req.ip,
    };
    // Chạy phần còn lại của request trong context này
    requestContextStorage.run(context, () => next());
  }
}

// Helper — gọi ở bất kỳ service nào
export function getRequestContext(): RequestContext | undefined {
  return requestContextStorage.getStore();
}
```

---

### 4.4 Đăng ký Middleware trong AppModule

```typescript
// src/app.module.ts
import { Module, NestModule, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import { PrismaModule } from './prisma/prisma.module';
import { configuration } from './config/configuration';
import { LoggerMiddleware } from './common/middleware/logger.middleware';
import { CorrelationIdMiddleware } from './common/middleware/correlation-id.middleware';
import { RequestContextMiddleware } from './common/middleware/request-context.middleware';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      validationSchema: Joi.object({
        NODE_ENV: Joi.string().valid('development', 'production', 'test').default('development'),
        PORT: Joi.number().default(3000),
        DATABASE_URL: Joi.string().required(),
        JWT_SECRET: Joi.string().required(),
        JWT_EXPIRES_IN: Joi.string().default('7d'),
      }),
    }),
    PrismaModule,
    AuthModule,
    UsersModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(
        CorrelationIdMiddleware,    // 1. Gắn correlation ID trước
        RequestContextMiddleware,   // 2. Setup async context
        LoggerMiddleware,           // 3. Log sau khi có context
      )
      .forRoutes({ path: '*', method: RequestMethod.ALL });

    // Các ví dụ route cụ thể hơn:
    // .forRoutes('users')
    // .forRoutes({ path: 'auth/*', method: RequestMethod.POST })
    // .forRoutes(UsersController)  // theo controller class
  }
}
```

---

### 4.5 Functional Middleware (dạng đơn giản)

```typescript
// src/common/middleware/api-key.middleware.ts
// Dùng khi middleware không cần inject service
import { Request, Response, NextFunction } from 'express';

export function apiKeyMiddleware(req: Request, res: Response, next: NextFunction) {
  const apiKey = req.headers['x-api-key'];
  if (!apiKey || apiKey !== process.env.INTERNAL_API_KEY) {
    return res.status(401).json({ message: 'Invalid API key' });
  }
  next();
}

// Đăng ký: consumer.apply(apiKeyMiddleware).forRoutes('internal/*');
```

---

## 5. MAIN.TS

```typescript
// src/main.ts
import { NestFactory } from '@nestjs/core';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const port = configService.get<number>('app.port', 3000);

  app.setGlobalPrefix('api');
  app.enableVersioning({ type: VersioningType.URI });

  app.enableCors({
    origin: configService.get<string>('app.corsOrigins', '*'),
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(new ResponseInterceptor());

  if (configService.get('app.env') !== 'production') {
    const config = new DocumentBuilder()
      .setTitle('API Docs')
      .setVersion('1.0')
      .addBearerAuth()
      .build();
    SwaggerModule.setup('docs', app, SwaggerModule.createDocument(app, config));
  }

  await app.listen(port);
  console.log(`🚀 http://localhost:${port}/api`);
}
bootstrap();
```

---

## 6. SERVICE VỚI PRISMA

```typescript
// src/modules/users/users.service.ts
import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PaginationDto } from '../../common/dto/pagination.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateUserDto) {
    const exists = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (exists) throw new ConflictException('Email already in use');

    const { password, ...rest } = dto;
    const hashed = await bcrypt.hash(password, 10);

    const { password: _, ...user } = await this.prisma.user.create({
      data: { ...rest, password: hashed },
    });
    return user;
  }

  async findAll(pagination: PaginationDto) {
    const { page = 1, limit = 20, search } = pagination;

    const where = {
      deletedAt: null,
      ...(search && {
        OR: [
          { firstName: { contains: search, mode: 'insensitive' as const } },
          { email: { contains: search, mode: 'insensitive' as const } },
        ],
      }),
    };

    const [data, total] = await this.prisma.$transaction([
      this.prisma.user.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true, email: true, firstName: true,
          lastName: true, role: true, isActive: true, createdAt: true,
        },
      }),
      this.prisma.user.count({ where }),
    ]);

    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findFirst({
      where: { id, deletedAt: null },
      select: {
        id: true, email: true, firstName: true,
        lastName: true, role: true, isActive: true, createdAt: true,
      },
    });
    if (!user) throw new NotFoundException(`User ${id} not found`);
    return user;
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async update(id: string, dto: UpdateUserDto) {
    await this.findOne(id);
    return this.prisma.user.update({
      where: { id },
      data: dto,
      select: { id: true, email: true, firstName: true, lastName: true, role: true },
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.prisma.user.update({
      where: { id },
      data: { deletedAt: new Date() }, // Soft delete
    });
  }
}
```

---

## 7. EXCEPTION FILTER (xử lý cả Prisma errors)

```typescript
// src/common/filters/http-exception.filter.ts
import {
  ExceptionFilter, Catch, ArgumentsHost,
  HttpException, HttpStatus, Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();
    const req = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message: string | string[] = 'Internal server error';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const body = exception.getResponse() as any;
      message = body.message || body;
    } else if (exception instanceof PrismaClientKnownRequestError) {
      // Map Prisma error codes → HTTP status
      if (exception.code === 'P2002') {
        status = HttpStatus.CONFLICT;
        message = 'Unique constraint violation';
      } else if (exception.code === 'P2025') {
        status = HttpStatus.NOT_FOUND;
        message = 'Record not found';
      }
    }

    this.logger.error(
      `${req.method} ${req.url} → ${status}`,
      exception instanceof Error ? exception.stack : '',
    );

    res.status(status).json({
      success: false,
      statusCode: status,
      message,
      path: req.url,
      timestamp: new Date().toISOString(),
    });
  }
}
```

---

## 8. PACKAGE.JSON — SCRIPTS PRISMA

```json
{
  "scripts": {
    "build": "nest build",
    "start": "node dist/main",
    "start:dev": "nest start --watch",
    "prisma:generate": "prisma generate",
    "prisma:migrate:dev": "prisma migrate dev",
    "prisma:migrate:deploy": "prisma migrate deploy",
    "prisma:studio": "prisma studio",
    "prisma:seed": "ts-node prisma/seed.ts",
    "test": "jest",
    "test:e2e": "jest --config ./test/jest-e2e.json"
  }
}
```

---

## 9. DOCKER COMPOSE

```yaml
version: '3.8'
services:
  api:
    build: .
    ports: ['3000:3000']
    environment:
      DATABASE_URL: postgresql://postgres:postgres@postgres:5432/mydb
    depends_on:
      postgres:
        condition: service_healthy

  postgres:
    image: postgres:15-alpine
    ports: ['5432:5432']
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: mydb
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ['CMD-SHELL', 'pg_isready -U postgres']
      interval: 5s
      retries: 5

volumes:
  postgres_data:
```

---

## 10. BẢNG SO SÁNH: Middleware vs các layer khác

| Nhu cầu | Dùng layer nào |
|---|---|
| Log request/response, inject header | **Middleware** |
| Kiểm tra auth, roles, permissions | **Guard** |
| Transform input/output, wrap response | **Interceptor** |
| Validate/parse request body, param | **Pipe** |
| Bắt và format lỗi | **Exception Filter** |

---

## 11. NGUYÊN TẮC QUAN TRỌNG

### ✅ NÊN LÀM
- `PrismaModule` đặt `@Global()` — inject khắp nơi không cần re-import
- Luôn dùng `select` trong Prisma query — không expose password
- Soft delete: `deletedAt` + filter `where: { deletedAt: null }`
- Prisma errors (P2002, P2025) xử lý trong Exception Filter
- Middleware đăng ký theo thứ tự: CorrelationId → Context → Logger
- Dùng `$transaction([...])` cho read + count song song

### ❌ TRÁNH
- `prisma.user.findMany()` không có `select` — lộ password
- Logic business trong controller
- Middleware dùng để kiểm tra auth — đó là việc của Guard
- Catch error im lặng mà không log

---

## 12. CHECKLIST KHỞI TẠO

```
□ nest new project-name --strict
□ npm install prisma @prisma/client
□ npx prisma init
□ Viết schema.prisma, chạy prisma migrate dev --name init
□ Tạo PrismaModule (@Global) + PrismaService
□ Setup ConfigModule + Joi validation
□ Tạo common/middleware/ (correlation-id, request-context, logger)
□ Đăng ký middleware trong AppModule implements NestModule
□ Setup GlobalPipe + GlobalFilter (Prisma errors) + GlobalInterceptor
□ Setup Auth module (JWT strategy dùng PrismaService)
□ Cấu hình Swagger
□ Docker Compose + .env.example
□ README.md
```