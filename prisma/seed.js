const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Bắt đầu seed database...');
  console.log('ℹ️  Script này sẽ kiểm tra và seed dữ liệu nếu database trống.');

  // Kiểm tra xem đã có dữ liệu chưa
  const existingUsers = await prisma.user.count();
  if (existingUsers > 0) {
    console.log('✅ Database đã có dữ liệu, bỏ qua việc seed.');
    console.log(`   👤 Số lượng users hiện tại: ${existingUsers}`);
    console.log('   💡 Nếu muốn seed lại, hãy xóa dữ liệu trong database trước.');
    return;
  }

  console.log('📭 Database trống, tiến hành seed dữ liệu mới...');

  // 1. Tạo Users
  console.log('👤 Tạo users...');
  const hashedPassword = await bcrypt.hash('admin123', 10);
  const userPassword = await bcrypt.hash('user123', 10);

  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@truckparts.com',
      password: hashedPassword,
      fullName: 'Admin Truck Parts',
      phone: '0901234567',
      role: 'ADMIN',
      isActive: true,
    },
  });

  const user1 = await prisma.user.create({
    data: {
      email: 'nguyenvan@gmail.com',
      password: userPassword,
      fullName: 'Nguyễn Văn An',
      phone: '0912345678',
      role: 'USER',
      isActive: true,
    },
  });

  const user2 = await prisma.user.create({
    data: {
      email: 'tranthibinh@gmail.com',
      password: userPassword,
      fullName: 'Trần Thị Bình',
      phone: '0923456789',
      role: 'USER',
      isActive: true,
    },
  });

  // 2. Tạo Brands
  console.log('🏷️  Tạo brands...');
  const brand1 = await prisma.brand.create({
    data: {
      name: 'Hino',
      slug: 'hino',
      imageUrl: '/images/brands/hino.png',
      isActive: true,
    },
  });

  const brand2 = await prisma.brand.create({
    data: {
      name: 'Hyundai',
      slug: 'hyundai',
      imageUrl: '/images/brands/hyundai.png',
      isActive: true,
    },
  });

  const brand3 = await prisma.brand.create({
    data: {
      name: 'Isuzu',
      slug: 'isuzu',
      imageUrl: '/images/brands/isuzu.png',
      isActive: true,
    },
  });

  const brand4 = await prisma.brand.create({
    data: {
      name: 'Thaco',
      slug: 'thaco',
      imageUrl: '/images/brands/thaco.png',
      isActive: true,
    },
  });

  // 3. Tạo Categories
  console.log('📂 Tạo categories...');
  const category1 = await prisma.category.create({
    data: {
      slug: 'dong-co',
      imageUrl: '/images/categories/engine.jpg',
      sortOrder: 1,
      isActive: true,
    },
  });

  const category2 = await prisma.category.create({
    data: {
      slug: 'phanh',
      imageUrl: '/images/categories/brake.jpg',
      sortOrder: 2,
      isActive: true,
    },
  });

  const category3 = await prisma.category.create({
    data: {
      slug: 'giam-soc',
      imageUrl: '/images/categories/suspension.jpg',
      sortOrder: 3,
      isActive: true,
    },
  });

  const category4 = await prisma.category.create({
    data: {
      slug: 'dien',
      imageUrl: '/images/categories/electrical.jpg',
      sortOrder: 4,
      isActive: true,
    },
  });

  const category5 = await prisma.category.create({
    data: {
      slug: 'thung-xe',
      imageUrl: '/images/categories/body.jpg',
      sortOrder: 5,
      isActive: true,
    },
  });

  // 4. Tạo CategoryTranslations
  console.log('🌐 Tạo category translations...');
  await prisma.categoryTranslation.createMany({
    data: [
      {
        categoryId: category1.id,
        language: 'vi',
        name: 'Động Cơ',
        description: 'Phụ tùng động cơ xe tải các loại',
      },
      {
        categoryId: category1.id,
        language: 'en',
        name: 'Engine',
        description: 'Engine parts for trucks',
      },
      {
        categoryId: category2.id,
        language: 'vi',
        name: 'Phanh',
        description: 'Hệ thống phanh và phụ tùng phanh',
      },
      {
        categoryId: category2.id,
        language: 'en',
        name: 'Brake',
        description: 'Brake system and brake parts',
      },
      {
        categoryId: category3.id,
        language: 'vi',
        name: 'Giảm Xóc',
        description: 'Hệ thống giảm sóc xe tải',
      },
      {
        categoryId: category3.id,
        language: 'en',
        name: 'Suspension',
        description: 'Truck suspension system',
      },
      {
        categoryId: category4.id,
        language: 'vi',
        name: 'Điện',
        description: 'Phụ tùng điện và hệ thống điện',
      },
      {
        categoryId: category4.id,
        language: 'en',
        name: 'Electrical',
        description: 'Electrical parts and systems',
      },
      {
        categoryId: category5.id,
        language: 'vi',
        name: 'Thùng Xe',
        description: 'Thùng xe và phụ kiện thùng',
      },
      {
        categoryId: category5.id,
        language: 'en',
        name: 'Body',
        description: 'Truck body and accessories',
      },
    ],
  });

  // 5. Tạo SubCategories
  console.log('📁 Tạo subcategories...');
  const subCat1 = await prisma.subCategory.create({
    data: {
      categoryId: category1.id,
      name: 'Bộ Lọc Dầu',
      slug: 'bo-loc-dau',
      isActive: true,
    },
  });

  const subCat2 = await prisma.subCategory.create({
    data: {
      categoryId: category1.id,
      name: 'Piston',
      slug: 'piston',
      isActive: true,
    },
  });

  const subCat3 = await prisma.subCategory.create({
    data: {
      categoryId: category2.id,
      name: 'Má Phanh',
      slug: 'ma-phanh',
      isActive: true,
    },
  });

  const subCat4 = await prisma.subCategory.create({
    data: {
      categoryId: category2.id,
      name: 'Đĩa Phanh',
      slug: 'dia-phanh',
      isActive: true,
    },
  });

  const subCat5 = await prisma.subCategory.create({
    data: {
      categoryId: category4.id,
      name: 'Ắc Quy',
      slug: 'ac-quy',
      isActive: true,
    },
  });

  // 6. Tạo Products
  console.log('📦 Tạo products...');
  const product1 = await prisma.product.create({
    data: {
      categoryId: category1.id,
      subCategoryId: subCat1.id,
      brandId: brand1.id,
      slug: 'bo-loc-dau-hino-500',
      sku: 'HF-HINO-500',
      partNumber: 'HINO-500-FL',
      stockQuantity: 50,
      stockStatus: 'IN_STOCK',
      warrantyMonths: 12,
      isFeatured: true,
      isNew: true,
      thumbnailUrl: '/images/products/oil-filter-hino.jpg',
      price: 450000,
      salePrice: 380000,
      isActive: true,
    },
  });

  const product2 = await prisma.product.create({
    data: {
      categoryId: category1.id,
      subCategoryId: subCat2.id,
      brandId: brand2.id,
      slug: 'piston-hyundai-xcient',
      sku: 'PS-HYU-XC',
      partNumber: 'HYU-PI-001',
      stockQuantity: 30,
      stockStatus: 'IN_STOCK',
      warrantyMonths: 24,
      isFeatured: true,
      isNew: false,
      thumbnailUrl: '/images/products/piston-hyundai.jpg',
      price: 1200000,
      isActive: true,
    },
  });

  const product3 = await prisma.product.create({
    data: {
      categoryId: category2.id,
      subCategoryId: subCat3.id,
      brandId: brand3.id,
      slug: 'ma-phanh-isuzu-elf',
      sku: 'BR-ISU-ELF',
      partNumber: 'ISU-BP-110',
      stockQuantity: 100,
      stockStatus: 'IN_STOCK',
      warrantyMonths: 6,
      isFeatured: true,
      isNew: true,
      thumbnailUrl: '/images/products/brake-pad-isuzu.jpg',
      price: 350000,
      salePrice: 300000,
      isActive: true,
    },
  });

  const product4 = await prisma.product.create({
    data: {
      categoryId: category2.id,
      subCategoryId: subCat4.id,
      brandId: brand4.id,
      slug: 'dia-phanh-thaco-otr',
      sku: 'BR-THA-OTR',
      partNumber: 'THA-BD-220',
      stockQuantity: 25,
      stockStatus: 'IN_STOCK',
      warrantyMonths: 12,
      isFeatured: false,
      isNew: false,
      thumbnailUrl: '/images/products/brake-disc-thaco.jpg',
      price: 850000,
      isActive: true,
    },
  });

  const product5 = await prisma.product.create({
    data: {
      categoryId: category4.id,
      subCategoryId: subCat5.id,
      brandId: brand1.id,
      slug: 'ac-quy-hino-12v',
      sku: 'EL-HINO-12V',
      partNumber: 'HINO-BAT-12V',
      stockQuantity: 40,
      stockStatus: 'IN_STOCK',
      warrantyMonths: 18,
      isFeatured: true,
      isNew: true,
      thumbnailUrl: '/images/products/battery-hino.jpg',
      price: 2500000,
      salePrice: 2200000,
      isActive: true,
    },
  });

  const product6 = await prisma.product.create({
    data: {
      categoryId: category3.id,
      brandId: brand2.id,
      slug: 'giam-soc-truoc-hyundai',
      sku: 'SS-HYU-FR',
      partNumber: 'HYU-SS-001',
      stockQuantity: 0,
      stockStatus: 'OUT_OF_STOCK',
      warrantyMonths: 12,
      isFeatured: false,
      isNew: false,
      thumbnailUrl: '/images/products/shock-absorber-hyundai.jpg',
      price: 1800000,
      isActive: true,
    },
  });

  // 7. Tạo ProductTranslations
  console.log('🌐 Tạo product translations...');
  await prisma.productTranslation.createMany({
    data: [
      {
        productId: product1.id,
        language: 'vi',
        name: 'Bộ Lọc Dầu Hino 500',
        shortDescription: 'Bộ lọc dầu chính hãng cho xe Hino 500',
        description: 'Bộ lọc dầu động cơ chính hãng Hino, được sản xuất theo tiêu chuẩn OEM, giúp lọc sạch dầu bôi trơn và bảo vệ động cơ xe tải Hino 500.',
      },
      {
        productId: product1.id,
        language: 'en',
        name: 'Hino 500 Oil Filter',
        shortDescription: 'Genuine oil filter for Hino 500 truck',
        description: 'Genuine Hino engine oil filter, manufactured to OEM standards, helps filter clean lubricating oil and protect Hino 500 truck engine.',
      },
      {
        productId: product2.id,
        language: 'vi',
        name: 'Piston Hyundai Xcient',
        shortDescription: 'Piston động cơ Hyundai Xcient',
        description: 'Piston chính hãng cho động cơ Hyundai Xcient, được làm từ vật liệu cao cấp, chịu nhiệt và áp suất tốt.',
      },
      {
        productId: product3.id,
        language: 'vi',
        name: 'Má Phanh Isuzu ELF',
        shortDescription: 'Má phanh trước Isuzu ELF',
        description: 'Má phanh chính hãng Isuzu ELF, độ bền cao, hiệu suất phanh tốt, an toàn khi sử dụng.',
      },
      {
        productId: product4.id,
        language: 'vi',
        name: 'Đĩa Phanh Thaco OTR',
        shortDescription: 'Đĩa phanh Thaco OTR 320',
        description: 'Đĩa phanh chính hãng Thaco OTR, được gia công chính xác, tản nhiệt tốt, tuổi thọ cao.',
      },
      {
        productId: product5.id,
        language: 'vi',
        name: 'Ắc Quy Hino 12V 100Ah',
        shortDescription: 'Ắc quy 12V cho xe Hino',
        description: 'Ắc quy chính hãng Hino 12V 100Ah, dung lượng lớn, khởi động mạnh mẽ, tuổi thọ cao.',
      },
      {
        productId: product6.id,
        language: 'vi',
        name: 'Giảm Xóc Trước Hyundai',
        shortDescription: 'Giảm xóc trước Hyundai Mighty',
        description: 'Giảm xóc trước chính hãng Hyundai Mighty, giúp xe vận hành êm ái trên mọi địa hình.',
      },
    ],
  });

  // 8. Tạo Provinces và Wards
  console.log('🗺️  Tạo provinces và wards...');
  const hanoi = await prisma.province.create({
    data: {
      name: 'Hà Nội',
      code: 'HN',
    },
  });

  const hcm = await prisma.province.create({
    data: {
      name: 'TP. Hồ Chí Minh',
      code: 'HCM',
    },
  });

  const danang = await prisma.province.create({
    data: {
      name: 'Đà Nẵng',
      code: 'DN',
    },
  });

  await prisma.ward.createMany({
    data: [
      { name: 'Phường Bách Khoa', code: 'HN-BK', provinceId: hanoi.id },
      { name: 'Phường Hai Bà Trưng', code: 'HN-HBT', provinceId: hanoi.id },
      { name: 'Phường Bến Thành', code: 'HCM-BT', provinceId: hcm.id },
      { name: 'Phường Quận 1', code: 'HCM-Q1', provinceId: hcm.id },
      { name: 'Phường Hải Châu', code: 'DN-HC', provinceId: danang.id },
      { name: 'Phường Thanh Khê', code: 'DN-TK', provinceId: danang.id },
    ],
  });

  // 9. Tạo ShippingMethods
  console.log('🚚 Tạo shipping methods...');
  await prisma.shippingMethod.createMany({
    data: [
      {
        code: 'STANDARD',
        name: 'Giao hàng tiêu chuẩn',
        price: 30000,
      },
      {
        code: 'EXPRESS',
        name: 'Giao hàng nhanh',
        price: 50000,
      },
      {
        code: 'SAME_DAY',
        name: 'Giao hàng trong ngày',
        price: 80000,
      },
      {
        code: 'FREE',
        name: 'Miễn phí vận chuyển',
        price: 0,
      },
    ],
  });

  // 10. Tạo BlogCategories
  console.log('📰 Tạo blog categories...');
  const blogCat1 = await prisma.blogCategory.create({
    data: {
      name: 'Tin Tức',
      slug: 'tin-tuc',
      isActive: true,
    },
  });

  const blogCat2 = await prisma.blogCategory.create({
    data: {
      name: 'Hướng Dẫn',
      slug: 'huong-dan',
      isActive: true,
    },
  });

  const blogCat3 = await prisma.blogCategory.create({
    data: {
      name: 'Kinh Nghiệm',
      slug: 'kinh-nghiem',
      isActive: true,
    },
  });

  // 11. Tạo BlogPosts
  console.log('📝 Tạo blog posts...');
  await prisma.blogPost.createMany({
    data: [
      {
        title: 'Hướng dẫn chọn phụ tùng xe tải phù hợp',
        slug: 'huong-dan-chon-phu-tung-xe-tai',
        excerpt: 'Bài viết hướng dẫn cách chọn phụ tùng xe tải chính hãng và phù hợp với xe của bạn.',
        content: '<h2>Cách chọn phụ tùng xe tải</h2><p>Khi chọn phụ tùng xe tải, bạn cần lưu ý các điểm sau:</p><ul><li>Chọn phụ tùng chính hãng</li><li>Kiểm tra thông số kỹ thuật</li><li>Mua từ đại lý uy tín</li></ul>',
        featuredImage: '/images/blog/select-parts.jpg',
        status: 'PUBLISHED',
        authorId: adminUser.id,
        categoryId: blogCat2.id,
      },
      {
        title: 'Bảo dưỡng xe tải mùa mưa',
        slug: 'bao-duong-xe-tai-mua-mua',
        excerpt: 'Những lưu ý quan trọng khi bảo dưỡng xe tải trong mùa mưa.',
        content: '<h2>Bảo dưỡng xe tải mùa mưa</h2><p>Mùa mưa là thời điểm xe tải cần được bảo dưỡng đặc biệt:</p><ol><li>Kiểm tra hệ thống phanh</li><li>Kiểm tra lốp xe</li><li>Kiểm tra hệ thống điện</li></ol>',
        featuredImage: '/images/blog/rainy-season.jpg',
        status: 'PUBLISHED',
        authorId: adminUser.id,
        categoryId: blogCat3.id,
      },
      {
        title: 'Ra mắt phụ tùng Hino 2024',
        slug: 'ra-mat-phu-tung-hino-2024',
        excerpt: 'Bộ sưu tập phụ tùng Hino mới nhất năm 2024 đã có mặt tại Truck Parts.',
        content: '<h2>Phụ tùng Hino 2024</h2><p>Chúng tôi vui mừng thông báo bộ sưu tập phụ tùng Hino 2024 đã có mặt...</p>',
        featuredImage: '/images/blog/hino-2024.jpg',
        status: 'PUBLISHED',
        authorId: adminUser.id,
        categoryId: blogCat1.id,
      },
    ],
  });

  // 12. Tạo Media
  console.log('🖼️  Tạo media...');
  await prisma.media.createMany({
    data: [
      {
        url: '/images/products/oil-filter-hino.jpg',
        type: 'image',
        publicId: 'products/oil-filter-hino',
      },
      {
        url: '/images/products/piston-hyundai.jpg',
        type: 'image',
        publicId: 'products/piston-hyundai',
      },
      {
        url: '/images/products/brake-pad-isuzu.jpg',
        type: 'image',
        publicId: 'products/brake-pad-isuzu',
      },
      {
        url: '/images/banners/home-banner.jpg',
        type: 'image',
        publicId: 'banners/home-banner',
      },
    ],
  });

  // 13. Tạo Addresses
  console.log('📍 Tạo addresses...');
  const wards = await prisma.ward.findMany();
  await prisma.address.createMany({
    data: [
      {
        userId: user1.id,
        provinceId: hanoi.id,
        wardId: wards[0].id,
        street: '123 Đường Láng, Đống Đa',
        postalCode: '100000',
        default: true,
      },
      {
        userId: user1.id,
        provinceId: hcm.id,
        wardId: wards[2].id,
        street: '456 Nguyễn Huệ, Quận 1',
        postalCode: '700000',
        default: false,
      },
      {
        userId: user2.id,
        provinceId: danang.id,
        wardId: wards[4].id,
        street: '789 Đường 2/9, Hải Châu',
        postalCode: '550000',
        default: true,
      },
    ],
  });

  // 14. Tạo CartItems
  console.log('🛒 Tạo cart items...');
  await prisma.cartItem.createMany({
    data: [
      {
        userId: user1.id,
        productId: product1.id,
        quantity: 2,
      },
      {
        userId: user1.id,
        productId: product3.id,
        quantity: 1,
      },
      {
        userId: user2.id,
        productId: product5.id,
        quantity: 1,
      },
    ],
  });

  // 15. Tạo WishlistItems
  console.log('❤️  Tạo wishlist items...');
  await prisma.wishlistItem.createMany({
    data: [
      {
        userId: user1.id,
        productId: product2.id,
      },
      {
        userId: user1.id,
        productId: product4.id,
      },
      {
        userId: user2.id,
        productId: product1.id,
      },
    ],
  });

  // 16. Tạo Orders
  console.log('📦 Tạo orders...');
  const shippingMethods = await prisma.shippingMethod.findMany();
  
  const order1 = await prisma.order.create({
    data: {
      userId: user1.id,
      totalPrice: 1060000,
      paymentMethod: 'BANK_TRANSFER',
      paymentStatus: 'PAID',
      shippingMethodId: shippingMethods[1].id,
      status: 'DELIVERED',
    },
  });

  const order2 = await prisma.order.create({
    data: {
      userId: user2.id,
      totalPrice: 2250000,
      paymentMethod: 'CASH',
      paymentStatus: 'PENDING',
      shippingMethodId: shippingMethods[0].id,
      status: 'PENDING',
    },
  });

  // 17. Tạo OrderItems
  console.log('📋 Tạo order items...');
  await prisma.orderItem.createMany({
    data: [
      {
        orderId: order1.id,
        productId: product1.id,
        quantity: 2,
        unitPrice: 380000,
        totalPrice: 760000,
      },
      {
        orderId: order1.id,
        productId: product3.id,
        quantity: 1,
        unitPrice: 300000,
        totalPrice: 300000,
      },
      {
        orderId: order2.id,
        productId: product5.id,
        quantity: 1,
        unitPrice: 2200000,
        totalPrice: 2200000,
      },
    ],
  });

  // 18. Tạo Contacts
  console.log('📞 Tạo contacts...');
  await prisma.contact.createMany({
    data: [
      {
        name: 'Lê Văn Cường',
        email: 'levancuong@gmail.com',
        phone: '0934567890',
        message: 'Tôi muốn hỏi về giá bộ lọc dầu Hino 500',
        isRead: false,
      },
      {
        name: 'Phạm Thị Dung',
        email: 'phamthidung@gmail.com',
        phone: '0945678901',
        message: 'Cho tôi hỏi thời gian bảo hành sản phẩm',
        isRead: true,
      },
    ],
  });

  // 19. Tạo legacy Posts
  console.log('📰 Tạo legacy posts...');
  await prisma.post.createMany({
    data: [
      {
        title: 'Giới thiệu Truck Parts',
        content: 'Truck Parts - Nơi cung cấp phụ tùng xe tải chính hãng',
        published: true,
        authorId: adminUser.id,
      },
      {
        title: 'Chính sách bảo hành',
        content: 'Chúng tôi cam kết bảo hành tất cả sản phẩm chính hãng',
        published: true,
        authorId: adminUser.id,
      },
    ],
  });

  console.log('');
  console.log('✅ Seed database thành công!');
  console.log('');
  console.log('📊 Thống kê dữ liệu đã tạo:');
  console.log(`   👤 Users: 3 (1 Admin, 2 User)`);
  console.log(`   🏷️  Brands: 4`);
  console.log(`   📂 Categories: 5`);
  console.log(`   📁 SubCategories: 5`);
  console.log(`   📦 Products: 6`);
  console.log(`   🗺️  Provinces: 3`);
  console.log(`   📍 Addresses: 3`);
  console.log(`   🚚 Shipping Methods: 4`);
  console.log(`   📰 Blog Categories: 3`);
  console.log(`   📝 Blog Posts: 3`);
  console.log(`   📦 Orders: 2`);
  console.log(`   🛒 Cart Items: 3`);
  console.log(`   ❤️  Wishlist Items: 3`);
  console.log(`   📞 Contacts: 2`);
  console.log('');
  console.log('🔑 Thông tin đăng nhập:');
  console.log('   Admin: admin@truckparts.com / admin123');
  console.log('   User 1: nguyenvan@gmail.com / user123');
  console.log('   User 2: tranthibinh@gmail.com / user123');
  console.log('');
}

main()
  .catch((e) => {
    console.error('❌ Lỗi khi seed database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });