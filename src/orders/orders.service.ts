import { BadRequestException, Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { OrdersRepository } from './orders.repository';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderQueryDto } from './dto/order-query.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';

@Injectable()
export class OrdersService {
  constructor(
    private readonly ordersRepository: OrdersRepository,
    private readonly prisma: PrismaService,
  ) {}

  async getOrdersForUser(userId: string, limit = 10, offset = 0) {
    return this.ordersRepository.findByUser(userId, limit, offset);
  }

  async getOrderById(userId: string, orderId: string, isAdmin = false) {
    const order = await this.ordersRepository.findOne(orderId);
    if (!order) throw new NotFoundException(`Order ${orderId} not found`);
    if (!isAdmin && order.userId !== userId) throw new ForbiddenException('Access denied');
    return order;
  }

  async createOrder(userId: string, dto: CreateOrderDto) {
    if (!dto.items || dto.items.length === 0) {
      throw new BadRequestException('Order items cannot be empty');
    }

    const products = await this.prisma.product.findMany({
      where: {
        id: { in: dto.items.map((item) => item.productId) },
        deletedAt: null,
        isActive: true,
      },
      select: {
        id: true,
        stockQuantity: true,
        price: true,
        salePrice: true,
      },
    });

    if (products.length !== dto.items.length) {
      throw new NotFoundException('One or more products not found or inactive');
    }

    const orderItems = dto.items.map((item) => {
      const product = products.find((p) => p.id === item.productId);
      if (!product) throw new NotFoundException(`Product ${item.productId} not found`);
      if (product.stockQuantity < item.quantity) {
        throw new BadRequestException(`Product ${item.productId} has insufficient stock`);
      }
      const unitPrice = product.salePrice ?? product.price;
      const subtotal = Number(unitPrice) * item.quantity;
      return {
        productId: item.productId,
        quantity: item.quantity,
        unitPrice: unitPrice.toString(),
        subtotal: subtotal.toString(),
      };
    });

    const totalAmount = orderItems
      .reduce((sum, item) => sum + Number(item.subtotal), 0)
      .toFixed(2);

    const created = await this.prisma.$transaction(async (tx) => {
      const order = await tx.order.create({
        data: {
          userId,
          addressId: dto.addressId,
          shippingMethodId: dto.shippingMethodId,
          paymentMethod: dto.paymentMethod,
          paymentStatus: 'PENDING',
          status: 'PENDING',
          totalPrice: totalAmount,
          orderItems: {
            create: orderItems.map((item) => ({
              productId: item.productId,
              quantity: item.quantity,
              unitPrice: item.unitPrice,
              totalPrice: item.subtotal,
            })),
          },
        },
        include: { orderItems: true },
      });

      for (const item of orderItems) {
        await tx.product.update({
          where: { id: item.productId },
          data: { stockQuantity: { decrement: Number(item.quantity) } },
        });
      }

      return order;
    });

    return created;
  }

  async cancelOrder(userId: string, orderId: string) {
    const order = await this.ordersRepository.findOne(orderId);
    if (!order) throw new NotFoundException(`Order ${orderId} not found`);
    if (order.userId !== userId) throw new ForbiddenException('Access denied');
    if (order.status !== 'PENDING') {
      throw new BadRequestException('Only pending orders can be cancelled');
    }

    return this.ordersRepository.cancelOrder(orderId);
  }

  async getAll(query: OrderQueryDto) {
    return this.ordersRepository.findAll(query);
  }

  async adminUpdateStatus(orderId: string, dto: UpdateOrderStatusDto) {
    const order = await this.ordersRepository.findOne(orderId);
    if (!order) throw new NotFoundException(`Order ${orderId} not found`);
    return this.ordersRepository.updateStatus(orderId, dto.status, dto.paymentStatus);
  }
}
