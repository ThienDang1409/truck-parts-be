import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PostModule } from './posts/posts.module';
import { ProductsModule } from './products/products.module';
import { OrdersModule } from './orders/orders.module';
import { LocationModule } from './location/location.module';
import { AddressModule } from './address/address.module';
import { BrandModule } from './brand/brand.module';
import { CategoryModule } from './category/category.module';
import { SubCategoryModule } from './subcategory/subcategory.module';
import { MediaModule } from './media/media.module';
import { BlogCategoryModule } from './blog-category/blog-category.module';
import { BlogModule } from './blog/blog.module';
import { CartModule } from './cart/cart.module';
import { WishlistModule } from './wishlist/wishlist.module';
import { ShippingMethodModule } from './shipping-method/shipping-method.module';
import { ContactModule } from './contact/contact.module';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { CommonModule } from './common/common.module';
import { envValidationSchema } from './config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: envValidationSchema,
      validationOptions: {
        allowUnknown: true,
        abortEarly: true,
      },
    }),
    PrismaModule,
    CommonModule,
    AuthModule,
    PostModule,
    ProductsModule,
    OrdersModule,
    LocationModule,
    AddressModule,
    BrandModule,
    CategoryModule,
    SubCategoryModule,
    MediaModule,
    BlogCategoryModule,
    BlogModule,
    CartModule,
    WishlistModule,
    ShippingMethodModule,
    ContactModule,
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
