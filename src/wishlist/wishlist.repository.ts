import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AddWishlistItemDto } from './dto/add-wishlist-item.dto';

@Injectable()
export class WishlistRepository {
  constructor(private readonly prisma: PrismaService) {}

  findByUser(userId: string) {
    return this.prisma.wishlistItem.findMany({ where: { userId, deletedAt: null } });
  }

  findOne(id: string) {
    return this.prisma.wishlistItem.findFirst({ where: { id, deletedAt: null } });
  }

  add(userId: string, data: AddWishlistItemDto) {
    return this.prisma.wishlistItem.create({ data: { userId, productId: data.productId } });
  }

  remove(id: string) {
    return this.prisma.wishlistItem.update({ where: { id }, data: { deletedAt: new Date() } });
  }
}
