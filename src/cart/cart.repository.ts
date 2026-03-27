import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AddCartItemDto } from './dto/add-cart-item.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';

@Injectable()
export class CartRepository {
  constructor(private readonly prisma: PrismaService) {}

  findByUser(userId: string) {
    return this.prisma.cartItem.findMany({ where: { userId, deletedAt: null } });
  }

  findOne(id: string) {
    return this.prisma.cartItem.findFirst({ where: { id, deletedAt: null } });
  }

  async add(userId: string, data: AddCartItemDto) {
    const existing = await this.prisma.cartItem.findFirst({ where: { userId, productId: data.productId, deletedAt: null } });
    if (existing) {
      return this.prisma.cartItem.update({
        where: { id: existing.id },
        data: { quantity: existing.quantity + data.quantity },
      });
    }
    return this.prisma.cartItem.create({
      data: { userId, productId: data.productId, quantity: data.quantity },
    });
  }

  update(id: string, data: UpdateCartItemDto) {
    return this.prisma.cartItem.update({ where: { id }, data });
  }

  remove(id: string) {
    return this.prisma.cartItem.update({ where: { id }, data: { deletedAt: new Date() } });
  }

  removeAll(userId: string) {
    return this.prisma.cartItem.updateMany({ where: { userId, deletedAt: null }, data: { deletedAt: new Date() } });
  }
}
