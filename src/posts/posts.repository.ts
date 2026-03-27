import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePostDto, UpdatePostDto } from './dto';

@Injectable()
export class PostRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(data: CreatePostDto) {
    return this.prisma.post.create({
      data: {
        title: data.title,
        content: data.content,
        published: data.published || false,
        authorId: data.authorId,
      },
      include: {
        author: true,
      },
    });
  }

  findAll(skip: number = 0, take: number = 10) {
    return Promise.all([
      this.prisma.post.findMany({
        skip,
        take,
        include: {
          author: true,
        },
        orderBy: {
          id: 'desc',
        },
      }),
      this.prisma.post.count(),
    ]).then(([posts, total]) => ({
      data: posts,
      total,
      page: Math.floor(skip / take) + 1,
      pageSize: take,
    }));
  }

  findOne(id: number) {
    return this.prisma.post.findUnique({
      where: { id },
      include: {
        author: true,
      },
    });
  }

  findByAuthor(authorId: string, skip: number = 0, take: number = 10) {
    return Promise.all([
      this.prisma.post.findMany({
        where: { authorId },
        skip,
        take,
        include: {
          author: true,
        },
        orderBy: {
          id: 'desc',
        },
      }),
      this.prisma.post.count({
        where: { authorId },
      }),
    ]).then(([posts, total]) => ({
      data: posts,
      total,
      page: Math.floor(skip / take) + 1,
      pageSize: take,
    }));
  }

  update(id: number, data: UpdatePostDto, currentData: any) {
    return this.prisma.post.update({
      where: { id },
      data: {
        title: data.title || currentData.title,
        content: data.content !== undefined ? data.content : currentData.content,
        published: data.published !== undefined ? data.published : currentData.published,
      },
      include: {
        author: true,
      },
    });
  }

  remove(id: number) {
    return this.prisma.post.delete({
      where: { id },
    });
  }

  publish(id: number) {
    return this.prisma.post.update({
      where: { id },
      data: {
        published: true,
      },
      include: {
        author: true,
      },
    });
  }

  unpublish(id: number) {
    return this.prisma.post.update({
      where: { id },
      data: {
        published: false,
      },
      include: {
        author: true,
      },
    });
  }
}
