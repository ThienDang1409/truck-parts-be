import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePostDto, UpdatePostDto } from './dto';

@Injectable()
export class PostService {
  constructor(private prisma: PrismaService) {}

  // Create - Tạo bài đăng mới
  async create(createPostDto: CreatePostDto) {
    try {
      // Kiểm tra người dùng tồn tại
      const user = await this.prisma.user.findUnique({
        where: { id: createPostDto.authorId },
      });

      if (!user) {
        throw new NotFoundException(
          `User with ID ${createPostDto.authorId} not found`,
        );
      }

      return await this.prisma.post.create({
        data: {
          title: createPostDto.title,
          content: createPostDto.content,
          published: createPostDto.published || false,
          authorId: createPostDto.authorId,
        },
        include: {
          author: true,
        },
      });
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Failed to create post');
    }
  }

  // Read - Lấy tất cả bài đăng
  async findAll(skip: number = 0, take: number = 10) {
    try {
      const posts = await this.prisma.post.findMany({
        skip,
        take,
        include: {
          author: true,
        },
        orderBy: {
          id: 'desc',
        },
      });

      const total = await this.prisma.post.count();

      return {
        data: posts,
        total,
        page: Math.floor(skip / take) + 1,
        pageSize: take,
      };
    } catch (error) {
      throw new BadRequestException('Failed to fetch posts');
    }
  }

  // Read - Lấy bài đăng theo ID
  async findOne(id: number) {
    try {
      const post = await this.prisma.post.findUnique({
        where: { id },
        include: {
          author: true,
        },
      });

      if (!post) {
        throw new NotFoundException(`Post with ID ${id} not found`);
      }

      return post;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Failed to fetch post');
    }
  }

  // Read - Lấy bài đăng theo tác giả
  async findByAuthor(authorId: number, skip: number = 0, take: number = 10) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id: authorId },
      });

      if (!user) {
        throw new NotFoundException(`User with ID ${authorId} not found`);
      }

      const posts = await this.prisma.post.findMany({
        where: { authorId },
        skip,
        take,
        include: {
          author: true,
        },
        orderBy: {
          id: 'desc',
        },
      });

      const total = await this.prisma.post.count({
        where: { authorId },
      });

      return {
        data: posts,
        total,
        page: Math.floor(skip / take) + 1,
        pageSize: take,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Failed to fetch author posts');
    }
  }

  // Update - Cập nhật bài đăng
  async update(id: number, updatePostDto: UpdatePostDto) {
    try {
      // Kiểm tra bài đăng tồn tại
      const post = await this.prisma.post.findUnique({
        where: { id },
      });

      if (!post) {
        throw new NotFoundException(`Post with ID ${id} not found`);
      }

      return await this.prisma.post.update({
        where: { id },
        data: {
          title: updatePostDto.title || post.title,
          content: updatePostDto.content !== undefined ? updatePostDto.content : post.content,
          published: updatePostDto.published !== undefined ? updatePostDto.published : post.published,
        },
        include: {
          author: true,
        },
      });
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Failed to update post');
    }
  }

  // Delete - Xóa bài đăng
  async remove(id: number) {
    try {
      const post = await this.prisma.post.findUnique({
        where: { id },
      });

      if (!post) {
        throw new NotFoundException(`Post with ID ${id} not found`);
      }

      await this.prisma.post.delete({
        where: { id },
      });

      return {
        message: `Post with ID ${id} has been deleted successfully`,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Failed to delete post');
    }
  }

  // Publish - Xuất bản bài đăng
  async publish(id: number) {
    try {
      const post = await this.prisma.post.findUnique({
        where: { id },
      });

      if (!post) {
        throw new NotFoundException(`Post with ID ${id} not found`);
      }

      return await this.prisma.post.update({
        where: { id },
        data: {
          published: true,
        },
        include: {
          author: true,
        },
      });
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Failed to publish post');
    }
  }

  // Unpublish - Bỏ xuất bản bài đăng
  async unpublish(id: number) {
    try {
      const post = await this.prisma.post.findUnique({
        where: { id },
      });

      if (!post) {
        throw new NotFoundException(`Post with ID ${id} not found`);
      }

      return await this.prisma.post.update({
        where: { id },
        data: {
          published: false,
        },
        include: {
          author: true,
        },
      });
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Failed to unpublish post');
    }
  }
}
