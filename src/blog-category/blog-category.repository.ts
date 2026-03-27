import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBlogCategoryDto } from './dto/create-blog-category.dto';
import { UpdateBlogCategoryDto } from './dto/update-blog-category.dto';

@Injectable()
export class BlogCategoryRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(data: CreateBlogCategoryDto) {
    return this.prisma.blogCategory.create({ data });
  }

  findAll() {
    return this.prisma.blogCategory.findMany({ where: { deletedAt: null } });
  }

  findOne(id: string) {
    return this.prisma.blogCategory.findFirst({ where: { id, deletedAt: null } });
  }

  update(id: string, data: UpdateBlogCategoryDto) {
    return this.prisma.blogCategory.update({ where: { id }, data });
  }

  remove(id: string) {
    return this.prisma.blogCategory.update({ where: { id }, data: { deletedAt: new Date() } });
  }
}
