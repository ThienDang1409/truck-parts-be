# Prisma Database Scripts

## 📋 Mô tả

Thư mục này chứa các script để quản lý dữ liệu database cho dự án truck-parts-be.

## 🚀 Các script có sẵn

### 1. Seed Database (Khởi tạo dữ liệu mẫu)

```bash
npm run db:seed
```

Script này sẽ:
- Kiểm tra database đã có dữ liệu chưa
- Nếu trống: Tạo dữ liệu mẫu (users, brands, categories, products, orders...)
- Nếu đã có: Bỏ qua và thông báo

### 2. Export Data (Xuất dữ liệu hiện có)

```bash
npm run db:export
```

Script này sẽ:
- Export tất cả dữ liệu từ database hiện tại
- Lưu vào file JSON trong thư mục `prisma/exports/`
- Tên file: `backup-YYYY-MM-DDTHH-MM-SS.json`

### 3. Import Data (Nhập dữ liệu từ backup)

```bash
npm run db:import <filename>
```

Ví dụ:
```bash
npm run db:import backup-2024-03-27.json
```

Script này sẽ:
- Xóa tất cả dữ liệu cũ trong database
- Import dữ liệu từ file backup
- Giữ nguyên cấu trúc và relationships

### 4. Reset Database (Reset database)

```bash
npm run db:reset
```

Script này sẽ:
- Xóa tất cả dữ liệu
- Chạy lại migrations
- Chạy seed script

### 5. Push Schema (Đẩy schema lên database)

```bash
npm run db:push
```

Script này sẽ:
- Đồng bộ Prisma schema với database
- Tạo/cập nhật bảng mà không tạo migration

### 6. Generate Client (Tạo Prisma Client)

```bash
npm run db:generate
```

Script này sẽ:
- Tạo/update Prisma Client từ schema
- Chạy tự động khi `npm install`

## 📁 Cấu trúc thư mục

```
prisma/
├── schema.prisma          # Prisma schema
├── seed.js                # Script seed dữ liệu
├── export-data.js         # Script export dữ liệu
├── import-data.js         # Script import dữ liệu
├── exports/               # Thư mục chứa file backup
│   └── backup-*.json      # Các file backup
├── migrations/            # Prisma migrations
│   └── */
└── README.md              # File hướng dẫn này
```

## 💡 Workflow khuyến nghị

### Khi bắt đầu project mới:
```bash
# 1. Push schema lên database
npm run db:push

# 2. Seed dữ liệu mẫu
npm run db:seed
```

### Khi muốn backup dữ liệu hiện tại:
```bash
# Export dữ liệu
npm run db:export

# File sẽ được lưu trong prisma/exports/
```

### Khi muốn restore dữ liệu từ backup:
```bash
# Import dữ liệu (thay <filename> bằng tên file backup)
npm run db:import <filename>
```

### Khi muốn reset database về trạng thái ban đầu:
```bash
# Reset database (xóa hết dữ liệu và seed lại)
npm run db:reset
```

## ⚠️ Lưu ý quan trọng

1. **Backup trước khi import**: Luôn export dữ liệu hiện tại trước khi import dữ liệu mới
2. **Kiểm tra file backup**: Đảm bảo file backup tồn tại trong thư mục `prisma/exports/`
3. **Dữ liệu nhạy cảm**: File backup có thể chứa thông tin nhạy cảm (passwords, emails)
4. **Không commit file backup**: Thêm `prisma/exports/` vào `.gitignore`

## 🔐 Thông tin đăng nhập mặc định (sau khi seed)

```
Admin:
  Email: admin@truckparts.com
  Password: admin123

User 1:
  Email: nguyenvan@gmail.com
  Password: user123

User 2:
  Email: tranthibinh@gmail.com
  Password: user123
```

## 🐛 Troubleshooting

### Lỗi "Database already has data"
- Script seed sẽ bỏ qua nếu database đã có dữ liệu
- Muốn seed lại: Chạy `npm run db:reset` trước

### Lỗi "File not found" khi import
- Kiểm tra file backup có trong thư mục `prisma/exports/`
- Chạy `npm run db:export` để tạo file backup trước

### Lỗi foreign key constraint
- Script import sẽ xóa dữ liệu theo đúng thứ tự
- Nếu lỗi: Thử chạy `npm run db:reset` trước

## 📞 Hỗ trợ

Nếu gặp vấn đề, liên hệ team development hoặc tạo issue trong repository.