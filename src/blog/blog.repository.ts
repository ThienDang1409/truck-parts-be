import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { BlogQueryDto } from './dto/blog-query.dto';

@Injectable()
export class BlogRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(data: CreateBlogDto) {
    return this.prisma.blogPost.create({ data });
  }

  findAll(query: BlogQueryDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const skip = (page - 1) * limit;

    const where: any = { deletedAt: null };
    if (query.status) where.status = query.status;
    if (query.categoryId) where.categoryId = query.categoryId;
    if (query.search) {
      where.OR = [
        { title: { contains: query.search, mode: 'insensitive' } },
        { excerpt: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    return this.prisma.$transaction([
      this.prisma.blogPost.findMany({
        where,
        include: { author: true, category: true },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.blogPost.count({ where }),
    ]).then(([data, total]) => ({ data, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } }));
  }

  findOne(id: string) {
    return this.prisma.blogPost.findFirst({
      where: { id, deletedAt: null },
      include: { author: true, category: true },
    });
  }

  update(id: string, data: UpdateBlogDto) {
    return this.prisma.blogPost.update({ where: { id }, data });
  }

  remove(id: string) {
    return this.prisma.blogPost.update({ where: { id }, data: { deletedAt: new Date() } });
  }
}
