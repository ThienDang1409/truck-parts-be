import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';

@Injectable()
export class AddressRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(data: CreateAddressDto) {
    return this.prisma.address.create({ data });
  }

  findAll(userId?: string) {
    return this.prisma.address.findMany({
      where: userId ? { userId, deletedAt: null } : { deletedAt: null },
      include: { province: true, ward: true },
    });
  }

  findOne(id: string) {
    return this.prisma.address.findFirst({
      where: { id, deletedAt: null },
      include: { province: true, ward: true },
    });
  }

  update(id: string, data: UpdateAddressDto) {
    return this.prisma.address.update({ where: { id }, data });
  }

  remove(id: string) {
    return this.prisma.address.update({ where: { id }, data: { deletedAt: new Date() } });
  }
}
