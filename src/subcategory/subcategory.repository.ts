import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSubCategoryDto } from './dto/create-subcategory.dto';
import { UpdateSubCategoryDto } from './dto/update-subcategory.dto';

@Injectable()
export class SubCategoryRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(data: CreateSubCategoryDto) {
    return this.prisma.subCategory.create({ data });
  }

  findAll() {
    return this.prisma.subCategory.findMany({ where: { deletedAt: null }, include: { category: true } });
  }

  findOne(id: string) {
    return this.prisma.subCategory.findFirst({ where: { id, deletedAt: null }, include: { category: true } });
  }

  update(id: string, data: UpdateSubCategoryDto) {
    return this.prisma.subCategory.update({ where: { id }, data });
  }

  remove(id: string) {
    return this.prisma.subCategory.update({ where: { id }, data: { deletedAt: new Date() } });
  }
}
