# Techfis Truck Parts FE - API / Routes / Error Handling Summary

## 1. Cấu hình chung

- `src/config/AxiosConfig.ts`:
  - baseURL = `BASE_URL` (mặc định theo `VITE_ENV`)
  - timeout: 15000ms.
  - headers: `Content-Type: application/json`, `Cache-Control`, `Pragma`, `If-Modified-Since`, `ngrok-skip-browser-warning`.
  - Interceptor request: attach `Authorization: Bearer <accessToken>` khi có token.
  - Interceptor response:
    - inspect lỗi, console.error { url, method, message, status, responseData }.
    - 401 + refreshToken => đăng refresh token, update access token, retry request.
    - refresh lỗi: clear tokens, redirect `/login`.

## 2. Token / auth utils

- `src/utils/common/tokenutils.ts`
  - saveAccessToken, saveRefreshToken, saveRole, getAccessToken, getRefreshToken, getRole, clearTokens.

## 3. Các endpoint REST (FE dùng contract này)

- `src/utils/common/constants.ts` => `REST_APIS`

### AUTH
- POST `/auth/login`
  - body: { email: string, password: string }
  - response: { data: { tokens: { accessToken, refreshToken }, role, ... }}
- POST `/auth/admin/signin`
  - body: { email: string, password: string }
  - response: { data: { tokens: { accessToken, refreshToken }, role, ... }}
- POST `/auth-service/auth/jwt/refresh-token`
  - body: { refreshToken: string }
  - response: { data: { tokens: { accessToken } } }
- POST `/auth/logout`
  - body: none
  - response: no data
- GET `/auth/me`
  - params: none
  - response: { data: { user: UserProfile } }
- PUT `/auth/me`
  - body: { fullName?: string, phone?: string, avatarUrl?: string }
  - response: { data: { user: UserProfile } }
- POST `/auth/change-password`
  - body: { oldPassword: string, newPassword: string, confirmPassword: string }
  - response: { data: ... }
- POST `/auth/pre-register`
  - body: { email: string }
  - response: { data: ... }
- POST `/auth/complete-register`
  - body: { token: string, password: string, fullName?: string, phone?: string }
  - response: { data: ... }

### CATEGORY
- GET `/categories`
  - params: { page?: number, limit?: number, lang?: string, search?: string }
  - response: { data: { categories: [], pagination: { page, limit, total, totalPages } } }
- POST `/categories`
  - body: CategoryFormData (thời gian FE mô tả `name`, `slug`, `description`, `image`,...) (tuỳ implementation)
  - response: { data: ... }
- PUT `/categories/:id`
  - body: Partial<CategoryFormData>
  - response: { data: ... }
- DELETE `/categories/:id`
  - response: { data: ... }
- GET `/categories/:id/translations`
  - response: { data: ... }

### SUBCATEGORY
- GET `/categories/:categoryId/subcategories`
  - params: { page?: number, limit?: number, lang?: string }
  - response: { data: ... }
- GET `/subcategories/:id/translations`
  - response: { data: ... }
- POST `/subcategories`
  - body: { name, slug, categoryId, ... } (FE thêm categoryId nếu truyền parentCategoryId)
  - response: { data: ... }
- PUT `/subcategories/:id`
  - body: any (có thể `{name, slug, ...}`)
  - response: { data: ... }
- DELETE `/subcategories/:id`
  - response: { data: ... }

### PRODUCT
- GET `/products`
  - params: { page?, limit?, lang?, categoryId?, subCategoryId?, brandId?, search?, sort?, ... }
  - response: { data: { products: [], pagination: {} } }
- GET `/products/:id`
  - params: { lang?: string }
  - response: { data: { product: {...} } }
- POST `/products`
  - body: product schema (FE dùng `productService.create(body)`)
  - response: { data: ... }
- PUT `/products/:id`
  - body: product schema partial
  - response: { data: ... }
- DELETE `/products/:id`
  - response: { data: ... }

### BRAND
- GET `/brands`
  - params: { page?, limit?, search? }
- GET `/brands/:id` (FE brandService.getById)
- POST `/brands`
  - body: { ...brand fields... }
- PUT `/brands/:id`
  - body: { ... }
- DELETE `/brands/:id`

### BLOG
- GET `/news/posts`
  - params: { page?, limit?, lang?, status?, search? }
  - response: array hoặc { data ... }
- GET `/news/posts/:id`
  - response: { data: { newsPost: BlogItem } }
- GET `/news/posts/slug/:slug`
  - response: { data: { newsPost: BlogItem } }
- POST `/news/posts`
  - body: BlogItemPayload, phải bao gồm `categoryIds: string[]`
- PUT `/news/posts/:id`
  - body: partial BlogItemPayload (title, slug, excerpt, content, featuredImage, status, categoryIds)
- DELETE `/news/posts/:id`

### BLOG CATEGORY
- GET `/news/categories`
  - params: { page?, limit?, search? }
- GET `/news/categories/:id`
- POST `/news/categories`
  - body: { name, slug, description?, ... }
- PUT `/news/categories/:id`
  - body: { name?, slug?, description? }
- DELETE `/news/categories/:id`

### USER
- GET `/users`
  - params: { search? }
- POST `/users`
  - body: CreateUserPayload (email, fullName, phone, role, password, etc.)
- DELETE `/users/:id`

### IMAGE
- POST `/upload/single`
  - body: FormData(file)
- POST `/upload/multiple`
  - body: FormData(files[])

### ADDRESS
- GET `/users/addresses`
- POST `/users/addresses`
  - body: address object (fullName, phone, addressLine, provinceId, wardId, isDefault,...)
- PUT `/users/addresses/:id`
  - body: address object updates
- DELETE `/users/addresses/:id`

### LOCATION
- GET `/locations/provinces`
- GET `/locations/provinces/:provinceId/wards`

### CONTACT
- POST `/contact`
  - body: { fullName: string, email: string, phone: string, message: string }
  - response: success message + status

### CART
- GET `/shop/cart/me`
  - params: { lang? }
- POST `/shop/cart`
  - body: { productId: string, quantity: number }
- PATCH `/shop/cart/:id`
  - body: { quantity: number }
- DELETE `/shop/cart/:id`

### WISHLIST
- GET `/shop/wishlist/me`
  - params: { lang? }
- POST `/shop/wishlist`
  - body: { productId: string }
- DELETE `/shop/wishlist/:id`

### ORDER
- GET `/orders`
- GET `/orders/:id`
- POST `/orders`
  - body: {
      items: [{ productId: string, quantity: number }],
      paymentMethod: "CASH" | "CREDIT_CARD" | "BANK_TRANSFER",
      shippingMethodId: string,
      addressId: string,
    }
- POST `/orders/:id/cancel`
- GET `/orders/all` (admin)
  - params: { limit?, offset?, status?, userId? }
- PUT `/admin/orders/:id`
  - body: { status: string, paymentStatus?: string }

### SHIPPING
- GET `/orders/shipping-methods`
- GET `/orders/shipping-methods/:id`
- POST `/orders/shipping-methods`
  - body: { code: string, name: string, price: string }
- PUT `/orders/shipping-methods/:id`
  - body: { code: string, name: string, price: string }
- DELETE `/orders/shipping-methods/:id`

## 4. Service layer mappings

- `src/services/authServices.ts` => `authService`: loginUser, loginAdmin, refreshToken, logout, getUserProfile, updateProfile, changePassword, preRegister, completeRegister.
- `src/services/productService.ts` => `productService`: getAll, getById, create, update, delete.
- `src/services/categoriesService.ts`, `brandService.ts`, `blogService.ts`, `blogCategoriesService.ts`, `userService.ts`, `addressService.ts`, `location service`, `cartService.ts`, `wishlistService.ts`, `orderService.ts`, `shippingMethodService.ts`, `subCategoryService.ts`.
  - Quy ước: gọi `api.get/post/put/delete` trực tiếp đến REST_APIS.

## 5. Route frontend (React Router)

- Định nghĩa route chính: `src/App.tsx` + `src/utils/routes/routes.tsx`

### Public
- `/` (Home)
- `/shop` (Shop)
- `/contact` (Contact)
- `/blog` (Blog list)
- `/blog-detail/:slug` (Blog detail)
- `/product-detail/:slug` (Product detail)
- `/product/:slug` (cũng Product detail)
- `/product-follow-cate/:id` (Product theo category)
- `/cart`, `/checkout`, `/search`, `/terms`, `/orders`
- `/register`, `/pre-register`, `/login`, `/profile`, `/wishlist`

### Admin (Protected)
- `/admin/login`
- `/dashboard`
- `/product-management`, `/brand-management`, `/category-management`, `/user-management`, `/blog-management`, `/blog-category-management`, `/order-management`, `/coupon-management`, `/shipping-method-management`

### Route bảo mật
- `ProtectedRoute` (`src/components/Admin/common/ProtectedRoute.tsx`): 
  - Kiểm tra access token + role `ADMIN`.
  - Nếu không token hoặc không admin => logout + redirect `/admin/login`.

## 6. Redux / state + lỗi

- `src/redux/store/store.ts`: configure store với slice cho các domain (auth, categories, products, brands, users, blogs, cart, wishlist, order, shipping, adminOrder, adminShipping, locations, addresses).

- Pattern error logic: `createAsyncThunk` trong slice:
  - `pending`: `isLoading = true`, `error = null`
  - `fulfilled`: cập nhật data, `isLoading = false`.
  - `rejected`: `isLoading = false`, `error = action.error.message` hoặc `action.payload`.

- `authSlice`:
  - login + loginUser + getProfile, xử lý `rejectWithValue(err.response?.data?.message || <fallback>)`.
  - logout xóa localStorage token.

- Các slice khác tương tự: `categoriesSlide`, `productSlide`, `blogSlice`, `cartSlice`, `wishlistSlice`, `orderSlice`, ...

## 7. Lỗi và toast handling

- Top-level: Axios interceptor log lỗi tất cả request.
- Token refresh 401 logic.
- `authSlice` convert API error message cho UI.
- 1 vài component sử dụng `toast` (ví dụ `ProtectedRoute`, và có thể ở nhiều nơi khác) để cảnh báo.

## 8. Chú ý BE cần đáp ứng

1. Phù hợp các endpoint trong `REST_APIS`.
2. JWT: trả `tokens: { accessToken, refreshToken }` và `role` trong login.
3. `/auth/me` trả profile theo `UserProfile` shape.
4. Refresh token đường dẫn `/auth-service/auth/jwt/refresh-token` (request body `{ refreshToken }`, response `tokens.accessToken`).
5. Theo logic FE, mọi endpoint cần trả 401 khi accessToken sai/expire, 403 khi role không đủ.
6. Cho phép query params `page`, `limit`, `lang` cho endpoints list (products, categories, blogs, v.v.).
7. Response data format FE mong muốn thường `res.data.data` (nhiều chỗ) hoặc `res.data`.

## 9. Cấu trúc code FE cần BE biết để tạo đúng API

- Danh mục service gọi endpoint & trả data trả về (nếu trả sai shape FE sẽ fail):
  - Product: {data: {products, pagination}}.
  - Category: {data: {categories}} hoặc tương tự.
  - Cart/Wishlist: data array item.
  - Order: check cả `GET /orders`, `GET /orders/all`, `PUT /admin/orders/:id`.

## 10. Schema chính (Field chi tiết lấy từ `src/types`)

- CategoryFormData (POST/PUT /categories)
  - imageUrl: string
  - sortOrder: number
  - isActive: boolean
  - translations: [{ language: "vi" | "en" | "ja", name: string, description: string }]

- CategoryParams (GET /categories)
  - page?: number
  - limit?: number
  - isActive?: boolean
  - search?: string
  - sortBy?: "name" | "sortOrder" | "createdAt"
  - sortOrder?: "asc" | "desc"
  - lang?: "vi" | "en" | "ja"

- SubcategoryItem
  - id, isActive, name, slug, imageUrl?, sortOrder?, description?
  - translations?, createdAt?, updatedAt?, _count?: { products: number }

- Product (cart & product data muestran in `cart.ts`)
  - id
  - categoryId
  - subCategoryId
  - brandId
  - slug, sku, partNumber
  - stockQuantity, stockStatus: "IN_STOCK" | "OUT_OF_STOCK" | "LOW_STOCK"
  - warrantyMonths, isFeatured, isNew, viewCount
  - thumbnailUrl, additionalImages, price, salePrice|null
  - createdAt, updatedAt

- CartItem
  - id, userId, productId, quantity, createdAt, updatedAt, product: any, selected?: boolean

- WishlistItem
  - id, userId, productId, slug, createdAt, product?: any

- BlogItemPayload (POST/PUT /news/posts)
  - categoryIds: string[]
  - title: string
  - slug: string
  - excerpt: string
  - content: string
  - featuredImage: string | File
  - status: "DRAFT" | "PUBLISHED"

- BlogParams (GET /news/posts)
  - page?, limit?, isActive?, search?, sortBy?, sortOrder?: "asc" | "desc"

- User
  - id, email, fullName, phone, avatarUrl, role, isActive, lastLogin, createdAt, updatedAt

- CreateUserPayload (POST /users)
  - email, password, fullName, phone

- ShippingMethod (admin/shipping)
  - id, code, name, price

- OrderItem (create order)
  - productId: string
  - quantity: number

- CreateOrderPayload
  - items: OrderItem[]
  - paymentMethod: "CASH" | "CREDIT_CARD" | "BANK_TRANSFER"
  - shippingMethodId: string
  - addressId: string

- BE sẽ cần hỗ trợ các trường filter/ tìm kiếm trong công thức truyền `params` từ productService/getAll + others.

---

*File này đã được auto tạo từ phân tích FE repository techfis-truck-parts (c:
ThienDM\learn\techfis-truck-parts) để bạn copy sang BE làm đúng contract.*
