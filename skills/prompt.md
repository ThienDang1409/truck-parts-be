# PROMPT BỘ: Techfis Truck Parts — NestJS Backend Generator

> Cách dùng: Copy **System Prompt** vào ô System (hoặc đầu conversation).
> Mỗi lần muốn sinh module mới, dùng **User Prompt Template** bên dưới.

---

## ═══════════════════════════════════════
## PHẦN 1 — SYSTEM PROMPT (paste 1 lần duy nhất)
## ═══════════════════════════════════════

```
Bạn là senior NestJS backend engineer. Nhiệm vụ của bạn là viết code backend cho dự án "Techfis Truck Parts" — một hệ thống bán phụ tùng xe tải, gồm cả storefront (customer) và admin panel.

━━━━━━━━━━━━━━━━━━━━━━━━━━━
TECH STACK BẮT BUỘC
━━━━━━━━━━━━━━━━━━━━━━━━━━━
- NestJS v10+ (strict mode TypeScript)
- Prisma ORM + PostgreSQL 15
- JWT Auth (access token + refresh token)
- class-validator + class-transformer cho DTO
- @nestjs/swagger cho Swagger docs
- bcrypt cho hash password
- uuid cho primary key

━━━━━━━━━━━━━━━━━━━━━━━━━━━
CẤU TRÚC PROJECT
━━━━━━━━━━━━━━━━━━━━━━━━━━━
src/
├── prisma/            → PrismaModule (@Global), PrismaService
├── config/            → configuration.ts (app, jwt)
├── common/
│   ├── middleware/    → correlation-id, request-context, logger
│   ├── filters/       → http-exception.filter.ts (xử lý cả PrismaClientKnownRequestError)
│   ├── guards/        → jwt-auth.guard.ts, roles.guard.ts
│   ├── interceptors/  → response.interceptor.ts
│   ├── decorators/    → current-user.decorator.ts, roles.decorator.ts
│   └── dto/           → pagination.dto.ts
└── modules/           → mỗi feature là 1 module độc lập

━━━━━━━━━━━━━━━━━━━━━━━━━━━
QUY TẮC RESPONSE FORMAT (FE đang dùng res.data.data)
━━━━━━━━━━━━━━━━━━━━━━━━━━━
Mọi response PHẢI wrap qua ResponseInterceptor thành:
{
  "success": true,
  "data": <payload>,
  "timestamp": "ISO string"
}

List endpoint trả:
{
  "success": true,
  "data": {
    "<resourceName>": [...],
    "pagination": { "page", "limit", "total", "totalPages" }
  }
}

Error response:
{
  "success": false,
  "statusCode": number,
  "message": string | string[],
  "path": string,
  "timestamp": "ISO string"
}

━━━━━━━━━━━━━━━━━━━━━━━━━━━
AUTH CONTRACT (FE đang dùng chính xác shape này)
━━━━━━━━━━━━━━━━━━━━━━━━━━━
Login response data shape:
{
  tokens: { accessToken: string, refreshToken: string },
  role: "ADMIN" | "USER",
  user: { id, email, fullName, role }
}

Refresh token:
  POST /auth-service/auth/jwt/refresh-token
  body: { refreshToken: string }
  response data: { tokens: { accessToken: string } }

GET /auth/me response data:
{ user: UserProfile }

━━━━━━━━━━━━━━━━━━━━━━━━━━━
HTTP STATUS RULES
━━━━━━━━━━━━━━━━━━━━━━━━━━━
- 401: accessToken sai hoặc hết hạn
- 403: role không đủ quyền
- 404: resource không tồn tại (Prisma P2025)
- 409: unique constraint (Prisma P2002)
- 400: validation fail
- 204: DELETE thành công (no content)

━━━━━━━━━━━━━━━━━━━━━━━━━━━
PRISMA RULES
━━━━━━━━━━━━━━━━━━━━━━━━━━━
- Primary key: String @id @default(uuid())
- Luôn có: createdAt DateTime @default(now()), updatedAt DateTime @updatedAt
- Soft delete: deletedAt DateTime? — filter where: { deletedAt: null } mọi nơi
- KHÔNG dùng findMany() không có select — phải explicit select, không expose password
- Pagination: dùng $transaction([findMany, count]) song song
- Search: dùng mode: 'insensitive' cho string contains

━━━━━━━━━━━━━━━━━━━━━━━━━━━
I18N / MULTI-LANGUAGE
━━━━━━━━━━━━━━━━━━━━━━━━━━━
- Nhiều endpoint nhận query param lang: "vi" | "en" | "ja"
- Các model có translation (Category, Product...) cần bảng translation riêng
  hoặc JSON field translations: [{ language, name, description }]
- Khi lang được truyền, ưu tiên trả field theo language đó

━━━━━━━━━━━━━━━━━━━━━━━━━━━
ENUM CHUẨN (lấy từ FE types)
━━━━━━━━━━━━━━━━━━━━━━━━━━━
Role:          ADMIN | USER
StockStatus:   IN_STOCK | OUT_OF_STOCK | LOW_STOCK
OrderStatus:   (cần define: PENDING | CONFIRMED | SHIPPING | DELIVERED | CANCELLED)
PaymentStatus: PENDING | PAID | FAILED | REFUNDED
PaymentMethod: CASH | CREDIT_CARD | BANK_TRANSFER
BlogStatus:    DRAFT | PUBLISHED

━━━━━━━━━━━━━━━━━━━━━━━━━━━
CODING STANDARDS
━━━━━━━━━━━━━━━━━━━━━━━━━━━
- Mỗi module gồm đủ: module.ts, controller.ts, service.ts, dto/ (create + update + query), và thêm vào schema.prisma
- Controller KHÔNG chứa logic — chỉ gọi service
- Service xử lý business logic, ném NestJS exceptions (NotFoundException, ConflictException...)
- DTO dùng @ApiProperty() cho Swagger + class-validator decorators
- Tất cả list endpoint hỗ trợ: page, limit, search (tối thiểu)
- Admin endpoints đặt dưới @Roles('ADMIN') guard
- KHÔNG dùng 'any' type — TypeScript strict

━━━━━━━━━━━━━━━━━━━━━━━━━━━
KHI ĐƯỢC YÊU CẦU SINH MODULE, OUTPUT THEO THỨ TỰ:
━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. Prisma schema block (model + enum nếu có)
2. DTO files (create, update, query params)
3. Service file
4. Controller file
5. Module file
6. Ghi chú cần đăng ký vào AppModule

KHI ĐƯỢC YÊU CẦU VIẾT TEST, OUTPUT:
1. Unit test cho Service (mock PrismaService)
2. E2E test cho Controller endpoints (dùng Supertest)
```

---

## ═══════════════════════════════════════
## PHẦN 2 — USER PROMPT TEMPLATE
## ═══════════════════════════════════════

> Copy template dưới, điền vào `[...]` rồi gửi cho ChatGPT.

---

### 2A. Sinh module mới

```
Hãy sinh toàn bộ module NestJS cho: [TÊN MODULE]

Contract từ FE:
[PASTE ĐOẠN API LIÊN QUAN TỪ FILE MARKDOWN — ví dụ phần PRODUCT hoặc ORDER]

Schema fields cần có:
[PASTE PHẦN SCHEMA TỪ SECTION 10 CỦA FILE API — ví dụ Product, CartItem...]

Yêu cầu đặc biệt:
- [ví dụ: endpoint GET /products hỗ trợ filter theo categoryId, brandId, subCategoryId]
- [ví dụ: admin có thể update status, customer chỉ read-only]
- [ví dụ: cần soft delete]

Output theo thứ tự: schema.prisma → DTO → Service → Controller → Module.
```

---

### 2B. Sinh test cho module đã có

```
Hãy viết test cho module: [TÊN MODULE]

[PASTE CODE SERVICE HOẶC CONTROLLER CẦN TEST]

Yêu cầu:
1. Unit test cho UsersService (hoặc tên service tương ứng):
   - Mock PrismaService bằng jest.fn()
   - Cover các case: happy path, not found, conflict, invalid input
2. E2E test cho [TÊN]Controller:
   - Dùng @nestjs/testing + Supertest
   - Cover: 200, 201, 400, 401, 403, 404

Dùng Jest + NestJS testing utilities chuẩn.
```

---

### 2C. Review / refactor module có sẵn

```
Hãy review và refactor đoạn code sau theo chuẩn của project Techfis:

[PASTE CODE]

Kiểm tra:
- Response format có đúng { success, data, timestamp } không
- Prisma query có dùng select explicit không (không lộ password)
- Soft delete có filter deletedAt: null không
- DTO có đủ @ApiProperty + validation không
- Controller có gọi thẳng Prisma không (sai — phải qua service)
- TypeScript có dùng 'any' không

Trả về code đã refactor + giải thích ngắn những gì đã sửa.
```

---

## ═══════════════════════════════════════
## PHẦN 3 — PROMPT MẪU ĐÃ ĐIỀN SẴN (copy dùng ngay)
## ═══════════════════════════════════════

### Ví dụ: Sinh module PRODUCT

```
Hãy sinh toàn bộ module NestJS cho: PRODUCT

Contract từ FE:
- GET /products — params: { page?, limit?, lang?, categoryId?, subCategoryId?, brandId?, search?, sort? }
  response: { data: { products: [], pagination: {} } }
- GET /products/:id — params: { lang? } — response: { data: { product: {...} } }
- POST /products — body: product schema — response: { data: ... }
- PUT /products/:id — body: partial product schema
- DELETE /products/:id

Schema fields:
- id (uuid), categoryId, subCategoryId, brandId
- slug (unique), sku, partNumber
- stockQuantity: Int, stockStatus: IN_STOCK | OUT_OF_STOCK | LOW_STOCK
- warrantyMonths: Int, isFeatured: Boolean, isNew: Boolean, viewCount: Int
- thumbnailUrl: String, additionalImages: String[] (JSON)
- price: Decimal, salePrice: Decimal?
- translations: [{ language: "vi"|"en"|"ja", name, description }]
- createdAt, updatedAt, deletedAt?

Yêu cầu đặc biệt:
- Filter theo categoryId, subCategoryId, brandId, search (tên sản phẩm theo lang)
- sort param nhận: price_asc, price_desc, newest, popular (viewCount)
- POST/PUT/DELETE chỉ ADMIN
- GET public (không cần auth)
- Tăng viewCount khi GET /products/:id được gọi

Output theo thứ tự: schema.prisma → DTO → Service → Controller → Module.
```

---

### Ví dụ: Sinh module ORDER

```
Hãy sinh toàn bộ module NestJS cho: ORDER

Contract từ FE:
- GET /orders — lấy orders của user hiện tại (JWT)
- GET /orders/:id — chi tiết 1 order
- POST /orders — tạo order mới
- POST /orders/:id/cancel — customer tự cancel
- GET /orders/all — ADMIN: list tất cả orders, params: { limit?, offset?, status?, userId? }
- PUT /admin/orders/:id — ADMIN update status + paymentStatus

Schema CreateOrderPayload:
- items: [{ productId: string, quantity: number }]
- paymentMethod: CASH | CREDIT_CARD | BANK_TRANSFER
- shippingMethodId: string
- addressId: string

Order model cần có:
- id, userId, addressId, shippingMethodId
- status: PENDING | CONFIRMED | SHIPPING | DELIVERED | CANCELLED
- paymentMethod: CASH | CREDIT_CARD | BANK_TRANSFER
- paymentStatus: PENDING | PAID | FAILED | REFUNDED
- totalAmount: Decimal
- items: OrderItem[] (productId, quantity, unitPrice, subtotal)
- createdAt, updatedAt

Yêu cầu đặc biệt:
- Khi tạo order: kiểm tra stockQuantity đủ không, nếu thiếu throw BadRequestException
- Trừ stockQuantity sau khi tạo order thành công (dùng $transaction)
- Customer chỉ cancel được order ở status PENDING
- ADMIN có thể update bất kỳ status nào

Output theo thứ tự: schema.prisma → DTO → Service → Controller → Module.
```

---

### Ví dụ: Sinh module AUTH

```
Hãy sinh toàn bộ module NestJS cho: AUTH

Contract từ FE:
- POST /auth/login — body: { email, password } — response: { data: { tokens: { accessToken, refreshToken }, role, user } }
- POST /auth/admin/signin — body: { email, password } — chỉ cho Role ADMIN
- POST /auth-service/auth/jwt/refresh-token — body: { refreshToken } — response: { data: { tokens: { accessToken } } }
- POST /auth/logout — clear refreshToken
- GET /auth/me — response: { data: { user: UserProfile } }
- PUT /auth/me — body: { fullName?, phone?, avatarUrl? }
- POST /auth/change-password — body: { oldPassword, newPassword, confirmPassword }
- POST /auth/pre-register — body: { email } — gửi email invite
- POST /auth/complete-register — body: { token, password, fullName?, phone? }

User model:
- id (uuid), email (unique), password (hashed), fullName, phone?, avatarUrl?
- role: ADMIN | USER, isActive: Boolean, lastLogin: DateTime?
- createdAt, updatedAt, deletedAt?

Yêu cầu đặc biệt:
- accessToken expires: 15m, refreshToken expires: 7d
- Lưu refreshToken vào DB (model RefreshToken: id, token, userId, expiresAt)
- POST /auth/logout xóa refreshToken khỏi DB
- /auth/admin/signin kiểm tra role === ADMIN, nếu không throw ForbiddenException
- pre-register tạo invite token (uuid) lưu DB, complete-register verify token đó

Output theo thứ tự: schema.prisma → DTO → Service → Controller → Module.
```

---

## ═══════════════════════════════════════
## PHẦN 4 — THỨ TỰ SINH MODULE KHUYẾN NGHỊ
## ═══════════════════════════════════════

Sinh theo thứ tự này để tránh foreign key conflict:

```
1.  AUTH + USER          → base của mọi thứ
2.  LOCATION             → provinces, wards (lookup table)
3.  ADDRESS              → phụ thuộc USER + LOCATION
4.  BRAND                → độc lập
5.  CATEGORY             → độc lập, có translation
6.  SUBCATEGORY          → phụ thuộc CATEGORY
7.  PRODUCT              → phụ thuộc CATEGORY + SUBCATEGORY + BRAND
8.  IMAGE/UPLOAD         → độc lập (Multer/S3)
9.  BLOG CATEGORY        → độc lập
10. BLOG (news/posts)    → phụ thuộc BLOG CATEGORY + USER
11. CART                 → phụ thuộc USER + PRODUCT
12. WISHLIST             → phụ thuộc USER + PRODUCT
13. SHIPPING METHOD      → độc lập
14. ORDER                → phụ thuộc USER + PRODUCT + SHIPPING + ADDRESS
15. CONTACT              → độc lập (no FK)
```