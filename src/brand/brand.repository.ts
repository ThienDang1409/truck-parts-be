import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';

@Injectable()
export class BrandRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(data: CreateBrandDto) {
    return this.prisma.brand.create({ data });
  }

  findAll() {
    return this.prisma.brand.findMany({ where: { deletedAt: null } });
  }

  findOne(id: string) {
    return this.prisma.brand.findFirst({ where: { id, deletedAt: null } });
  }

  update(id: string, data: UpdateBrandDto) {
    return this.prisma.brand.update({ where: { id }, data });
  }

  remove(id: string) {
    return this.prisma.brand.update({ where: { id }, data: { deletedAt: new Date() } });
  }
}
