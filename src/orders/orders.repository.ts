import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderQueryDto } from './dto/order-query.dto';

@Injectable()
export class OrdersRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findByUser(userId: string, limit: number, offset: number) {
    const [orders, total] = await this.prisma.$transaction([
      this.prisma.order.findMany({
        where: { userId, deletedAt: null },
        take: limit,
        skip: offset,
        orderBy: { createdAt: 'desc' },
        include: {
          orderItems: true,
        },
      }),
      this.prisma.order.count({ where: { userId, deletedAt: null } }),
    ]);

    return { orders, total };
  }

  async findOne(id: string) {
    return this.prisma.order.findFirst({
      where: { id, deletedAt: null },
      include: {
        orderItems: true,
      },
    });
  }

  async create(userId: string, dto: CreateOrderDto, totalAmount: string, items: any[]) {
    return this.prisma.order.create({
      data: {
        userId,
        addressId: dto.addressId,
        shippingMethodId: dto.shippingMethodId,
        paymentMethod: dto.paymentMethod,
        paymentStatus: 'PENDING',
        status: 'PENDING',
        totalPrice: totalAmount,
        orderItems: {
          create: items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            totalPrice: item.subtotal,
          })),
        },
      },
      include: {
        orderItems: true,
      },
    });
  }

  async updateStatus(id: string, status: import('@prisma/client').OrderStatus, paymentStatus: import('@prisma/client').PaymentStatus) {
    return this.prisma.order.update({
      where: { id },
      data: { status, paymentStatus },
      include: { orderItems: true },
    });
  }

  async cancelOrder(id: string) {
    return this.prisma.order.update({
      where: { id },
      data: { status: 'CANCELLED' },
      include: { orderItems: true },
    });
  }

  async findAll(query: OrderQueryDto) {
    const where: any = { deletedAt: null };
    if (query.status) where.status = query.status;
    if (query.userId) where.userId = query.userId;

    const [orders, total] = await this.prisma.$transaction([
      this.prisma.order.findMany({
        where,
        take: query.limit ?? 10,
        skip: query.offset ?? 0,
        orderBy: { createdAt: 'desc' },
        include: { orderItems: true, user: true },
      }),
      this.prisma.order.count({ where }),
    ]);

    return { orders, total };
  }
}
