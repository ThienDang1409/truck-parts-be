import { Injectable, NotFoundException } from '@nestjs/common';
import { BlogRepository } from './blog.repository';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { BlogQueryDto } from './dto/blog-query.dto';

@Injectable()
export class BlogService {
  constructor(private readonly blogRepository: BlogRepository) {}

  create(dto: CreateBlogDto) {
    return this.blogRepository.create(dto);
  }

  findAll(query: BlogQueryDto) {
    return this.blogRepository.findAll(query);
  }

  async findOne(id: string) {
    const blog = await this.blogRepository.findOne(id);
    if (!blog) throw new NotFoundException('Blog post not found');
    return blog;
  }

  update(id: string, dto: UpdateBlogDto) {
    return this.blogRepository.update(id, dto);
  }

  remove(id: string) {
    return this.blogRepository.remove(id);
  }
}
