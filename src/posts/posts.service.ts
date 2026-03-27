import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PostRepository } from './posts.repository';
import { CreatePostDto, UpdatePostDto } from './dto';

@Injectable()
export class PostService {
  constructor(
    private readonly postRepository: PostRepository,
    private readonly prisma: PrismaService,
  ) {}

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

      return await this.postRepository.create(createPostDto);
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
      return await this.postRepository.findAll(skip, take);
    } catch (error) {
      throw new BadRequestException('Failed to fetch posts');
    }
  }

  // Read - Lấy bài đăng theo ID
  async findOne(id: number) {
    try {
      const post = await this.postRepository.findOne(id);

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
  async findByAuthor(authorId: string, skip: number = 0, take: number = 10) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id: authorId },
      });

      if (!user) {
        throw new NotFoundException(`User with ID ${authorId} not found`);
      }

      return await this.postRepository.findByAuthor(authorId, skip, take);
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
      const post = await this.postRepository.findOne(id);

      if (!post) {
        throw new NotFoundException(`Post with ID ${id} not found`);
      }

      return await this.postRepository.update(id, updatePostDto, post);
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
      const post = await this.postRepository.findOne(id);

      if (!post) {
        throw new NotFoundException(`Post with ID ${id} not found`);
      }

      await this.postRepository.remove(id);

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
      const post = await this.postRepository.findOne(id);

      if (!post) {
        throw new NotFoundException(`Post with ID ${id} not found`);
      }

      return await this.postRepository.publish(id);
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
      const post = await this.postRepository.findOne(id);

      if (!post) {
        throw new NotFoundException(`Post with ID ${id} not found`);
      }

      return await this.postRepository.unpublish(id);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Failed to unpublish post');
    }
  }
}
