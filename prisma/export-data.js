const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

async function exportData() {
  console.log('📤 Bắt đầu export dữ liệu từ database...');
  console.log('');

  try {
    // Export tất cả dữ liệu từ các bảng
    const data = {};

    // 1. Users
    console.log('👤 Export users...');
    data.users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        fullName: true,
        phone: true,
        avatarUrl: true,
        role: true,
        isActive: true,
        createdAt: true,
      }
    });

    // 2. Brands
    console.log('🏷️  Export brands...');
    data.brands = await prisma.brand.findMany();

    // 3. Categories
    console.log('📂 Export categories...');
    data.categories = await prisma.category.findMany();

    // 4. SubCategories
    console.log('📁 Export subcategories...');
    data.subCategories = await prisma.subCategory.findMany();

    // 5. CategoryTranslations
    console.log('🌐 Export category translations...');
    data.categoryTranslations = await prisma.categoryTranslation.findMany();

    // 6. Products
    console.log('📦 Export products...');
    data.products = await prisma.product.findMany();

    // 7. ProductTranslations
    console.log('🌐 Export product translations...');
    data.productTranslations = await prisma.productTranslation.findMany();

    // 8. Provinces
    console.log('🗺️  Export provinces...');
    data.provinces = await prisma.province.findMany();

    // 9. Wards
    console.log('🏘️  Export wards...');
    data.wards = await prisma.ward.findMany();

    // 10. Addresses
    console.log('📍 Export addresses...');
    data.addresses = await prisma.address.findMany();

    // 11. Media
    console.log('🖼️  Export media...');
    data.media = await prisma.media.findMany();

    // 12. BlogCategories
    console.log('📰 Export blog categories...');
    data.blogCategories = await prisma.blogCategory.findMany();

    // 13. BlogPosts
    console.log('📝 Export blog posts...');
    data.blogPosts = await prisma.blogPost.findMany({
      select: {
        id: true,
        title: true,
        slug: true,
        excerpt: true,
        content: true,
        featuredImage: true,
        status: true,
        viewCount: true,
        authorId: true,
        categoryId: true,
        createdAt: true,
      }
    });

    // 14. ShippingMethods
    console.log('🚚 Export shipping methods...');
    data.shippingMethods = await prisma.shippingMethod.findMany();

    // 15. Contacts
    console.log('📞 Export contacts...');
    data.contacts = await prisma.contact.findMany();

    // 16. Posts (legacy)
    console.log('📰 Export legacy posts...');
    data.posts = await prisma.post.findMany();

    // 17. Orders
    console.log('📦 Export orders...');
    data.orders = await prisma.order.findMany();

    // 18. OrderItems
    console.log('📋 Export order items...');
    data.orderItems = await prisma.orderItem.findMany();

    // 19. CartItems
    console.log('🛒 Export cart items...');
    data.cartItems = await prisma.cartItem.findMany();

    // 20. WishlistItems
    console.log('❤️  Export wishlist items...');
    data.wishlistItems = await prisma.wishlistItem.findMany();

    // Tạo thư mục export nếu chưa có
    const exportDir = path.join(__dirname, 'exports');
    if (!fs.existsSync(exportDir)) {
      fs.mkdirSync(exportDir, { recursive: true });
    }

    // Lưu dữ liệu vào file JSON
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `backup-${timestamp}.json`;
    const filepath = path.join(exportDir, filename);

    fs.writeFileSync(filepath, JSON.stringify(data, null, 2), 'utf8');

    console.log('');
    console.log('✅ Export dữ liệu thành công!');
    console.log('');
    console.log('📊 Thống kê dữ liệu đã export:');
    console.log(`   👤 Users: ${data.users.length}`);
    console.log(`   🏷️  Brands: ${data.brands.length}`);
    console.log(`   📂 Categories: ${data.categories.length}`);
    console.log(`   📁 SubCategories: ${data.subCategories.length}`);
    console.log(`   🌐 Category Translations: ${data.categoryTranslations.length}`);
    console.log(`   📦 Products: ${data.products.length}`);
    console.log(`   🌐 Product Translations: ${data.productTranslations.length}`);
    console.log(`   🗺️  Provinces: ${data.provinces.length}`);
    console.log(`   🏘️  Wards: ${data.wards.length}`);
    console.log(`   📍 Addresses: ${data.addresses.length}`);
    console.log(`   🖼️  Media: ${data.media.length}`);
    console.log(`   📰 Blog Categories: ${data.blogCategories.length}`);
    console.log(`   📝 Blog Posts: ${data.blogPosts.length}`);
    console.log(`   🚚 Shipping Methods: ${data.shippingMethods.length}`);
    console.log(`   📞 Contacts: ${data.contacts.length}`);
    console.log(`   📦 Orders: ${data.orders.length}`);
    console.log(`   📋 Order Items: ${data.orderItems.length}`);
    console.log(`   🛒 Cart Items: ${data.cartItems.length}`);
    console.log(`   ❤️  Wishlist Items: ${data.wishlistItems.length}`);
    console.log(`   📰 Legacy Posts: ${data.posts.length}`);
    console.log('');
    console.log(`📁 File đã lưu tại: ${filepath}`);
    console.log('');

  } catch (error) {
    console.error('❌ Lỗi khi export dữ liệu:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

exportData();