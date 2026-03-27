const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

async function importData(filename) {
  console.log('📥 Bắt đầu import dữ liệu vào database...');
  console.log('');

  try {
    // Đọc file dữ liệu
    const filepath = path.join(__dirname, 'exports', filename);
    
    if (!fs.existsSync(filepath)) {
      console.error(`❌ Không tìm thấy file: ${filepath}`);
      console.log('💡 Hãy chạy "npm run db:export" để tạo file backup trước.');
      process.exit(1);
    }

    console.log(`📁 Đọc file: ${filepath}`);
    const fileContent = fs.readFileSync(filepath, 'utf8');
    const data = JSON.parse(fileContent);

    // Xóa dữ liệu cũ (theo thứ tự để tránh foreign key constraint)
    console.log('🗑️  Xóa dữ liệu cũ...');
    await prisma.orderItem.deleteMany();
    await prisma.order.deleteMany();
    await prisma.cartItem.deleteMany();
    await prisma.wishlistItem.deleteMany();
    await prisma.address.deleteMany();
    await prisma.ward.deleteMany();
    await prisma.province.deleteMany();
    await prisma.productTranslation.deleteMany();
    await prisma.product.deleteMany();
    await prisma.categoryTranslation.deleteMany();
    await prisma.subCategory.deleteMany();
    await prisma.category.deleteMany();
    await prisma.brand.deleteMany();
    await prisma.post.deleteMany();
    await prisma.blogPost.deleteMany();
    await prisma.blogCategory.deleteMany();
    await prisma.media.deleteMany();
    await prisma.contact.deleteMany();
    await prisma.shippingMethod.deleteMany();
    await prisma.user.deleteMany();

    // Import dữ liệu theo thứ tự
    
    // 1. Users
    if (data.users && data.users.length > 0) {
      console.log(`👤 Import ${data.users.length} users...`);
      for (const user of data.users) {
        await prisma.user.create({ data: user });
      }
    }

    // 2. Brands
    if (data.brands && data.brands.length > 0) {
      console.log(`🏷️  Import ${data.brands.length} brands...`);
      for (const brand of data.brands) {
        await prisma.brand.create({ data: brand });
      }
    }

    // 3. Categories
    if (data.categories && data.categories.length > 0) {
      console.log(`📂 Import ${data.categories.length} categories...`);
      for (const category of data.categories) {
        await prisma.category.create({ data: category });
      }
    }

    // 4. SubCategories
    if (data.subCategories && data.subCategories.length > 0) {
      console.log(`📁 Import ${data.subCategories.length} subcategories...`);
      for (const subCategory of data.subCategories) {
        await prisma.subCategory.create({ data: subCategory });
      }
    }

    // 5. CategoryTranslations
    if (data.categoryTranslations && data.categoryTranslations.length > 0) {
      console.log(`🌐 Import ${data.categoryTranslations.length} category translations...`);
      for (const translation of data.categoryTranslations) {
        await prisma.categoryTranslation.create({ data: translation });
      }
    }

    // 6. Products
    if (data.products && data.products.length > 0) {
      console.log(`📦 Import ${data.products.length} products...`);
      for (const product of data.products) {
        await prisma.product.create({ data: product });
      }
    }

    // 7. ProductTranslations
    if (data.productTranslations && data.productTranslations.length > 0) {
      console.log(`🌐 Import ${data.productTranslations.length} product translations...`);
      for (const translation of data.productTranslations) {
        await prisma.productTranslation.create({ data: translation });
      }
    }

    // 8. Provinces
    if (data.provinces && data.provinces.length > 0) {
      console.log(`🗺️  Import ${data.provinces.length} provinces...`);
      for (const province of data.provinces) {
        await prisma.province.create({ data: province });
      }
    }

    // 9. Wards
    if (data.wards && data.wards.length > 0) {
      console.log(`🏘️  Import ${data.wards.length} wards...`);
      for (const ward of data.wards) {
        await prisma.ward.create({ data: ward });
      }
    }

    // 10. Addresses
    if (data.addresses && data.addresses.length > 0) {
      console.log(`📍 Import ${data.addresses.length} addresses...`);
      for (const address of data.addresses) {
        await prisma.address.create({ data: address });
      }
    }

    // 11. Media
    if (data.media && data.media.length > 0) {
      console.log(`🖼️  Import ${data.media.length} media...`);
      for (const media of data.media) {
        await prisma.media.create({ data: media });
      }
    }

    // 12. BlogCategories
    if (data.blogCategories && data.blogCategories.length > 0) {
      console.log(`📰 Import ${data.blogCategories.length} blog categories...`);
      for (const blogCategory of data.blogCategories) {
        await prisma.blogCategory.create({ data: blogCategory });
      }
    }

    // 13. BlogPosts
    if (data.blogPosts && data.blogPosts.length > 0) {
      console.log(`📝 Import ${data.blogPosts.length} blog posts...`);
      for (const blogPost of data.blogPosts) {
        await prisma.blogPost.create({ data: blogPost });
      }
    }

    // 14. ShippingMethods
    if (data.shippingMethods && data.shippingMethods.length > 0) {
      console.log(`🚚 Import ${data.shippingMethods.length} shipping methods...`);
      for (const shippingMethod of data.shippingMethods) {
        await prisma.shippingMethod.create({ data: shippingMethod });
      }
    }

    // 15. Contacts
    if (data.contacts && data.contacts.length > 0) {
      console.log(`📞 Import ${data.contacts.length} contacts...`);
      for (const contact of data.contacts) {
        await prisma.contact.create({ data: contact });
      }
    }

    // 16. Posts (legacy)
    if (data.posts && data.posts.length > 0) {
      console.log(`📰 Import ${data.posts.length} legacy posts...`);
      for (const post of data.posts) {
        await prisma.post.create({ data: post });
      }
    }

    // 17. Orders
    if (data.orders && data.orders.length > 0) {
      console.log(`📦 Import ${data.orders.length} orders...`);
      for (const order of data.orders) {
        await prisma.order.create({ data: order });
      }
    }

    // 18. OrderItems
    if (data.orderItems && data.orderItems.length > 0) {
      console.log(`📋 Import ${data.orderItems.length} order items...`);
      for (const orderItem of data.orderItems) {
        await prisma.orderItem.create({ data: orderItem });
      }
    }

    // 19. CartItems
    if (data.cartItems && data.cartItems.length > 0) {
      console.log(`🛒 Import ${data.cartItems.length} cart items...`);
      for (const cartItem of data.cartItems) {
        await prisma.cartItem.create({ data: cartItem });
      }
    }

    // 20. WishlistItems
    if (data.wishlistItems && data.wishlistItems.length > 0) {
      console.log(`❤️  Import ${data.wishlistItems.length} wishlist items...`);
      for (const wishlistItem of data.wishlistItems) {
        await prisma.wishlistItem.create({ data: wishlistItem });
      }
    }

    console.log('');
    console.log('✅ Import dữ liệu thành công!');
    console.log('');

  } catch (error) {
    console.error('❌ Lỗi khi import dữ liệu:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Lấy tên file từ command line argument
const filename = process.argv[2];

if (!filename) {
  console.log('❓ Cách sử dụng:');
  console.log('   node prisma/import-data.js <filename>');
  console.log('');
  console.log('📖 Ví dụ:');
  console.log('   node prisma/import-data.js backup-2024-03-27.json');
  console.log('');
  console.log('💡 Để xem danh sách file backup, chạy:');
  console.log('   ls prisma/exports/');
  process.exit(0);
}

importData(filename);