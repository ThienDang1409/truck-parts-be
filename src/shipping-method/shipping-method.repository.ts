import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateShippingMethodDto } from './dto/create-shipping-method.dto';
import { UpdateShippingMethodDto } from './dto/update-shipping-method.dto';

@Injectable()
export class ShippingMethodRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(data: CreateShippingMethodDto) {
    return this.prisma.shippingMethod.create({ data });
  }

  findAll() {
    return this.prisma.shippingMethod.findMany({ where: { deletedAt: null } });
  }

  findOne(id: string) {
    return this.prisma.shippingMethod.findFirst({ where: { id, deletedAt: null } });
  }

  update(id: string, data: UpdateShippingMethodDto) {
    return this.prisma.shippingMethod.update({ where: { id }, data });
  }

  remove(id: string) {
    return this.prisma.shippingMethod.update({ where: { id }, data: { deletedAt: new Date() } });
  }
}
