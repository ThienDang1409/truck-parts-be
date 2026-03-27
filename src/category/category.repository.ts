import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoryRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(data: CreateCategoryDto) {
    return this.prisma.category.create({ data });
  }

  findAll() {
    return this.prisma.category.findMany({
      where: { deletedAt: null },
      include: { translations: true, subCategories: true },
      orderBy: { sortOrder: 'asc' },
    });
  }

  findOne(id: string) {
    return this.prisma.category.findFirst({
      where: { id, deletedAt: null },
      include: { translations: true, subCategories: true },
    });
  }

  update(id: string, data: UpdateCategoryDto) {
    return this.prisma.category.update({ where: { id }, data });
  }

  remove(id: string) {
    return this.prisma.category.update({ where: { id }, data: { deletedAt: new Date() } });
  }
}
