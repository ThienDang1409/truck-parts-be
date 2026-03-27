import { Injectable, NotFoundException } from '@nestjs/common';
import { BlogCategoryRepository } from './blog-category.repository';
import { CreateBlogCategoryDto } from './dto/create-blog-category.dto';
import { UpdateBlogCategoryDto } from './dto/update-blog-category.dto';

@Injectable()
export class BlogCategoryService {
  constructor(private readonly blogCategoryRepository: BlogCategoryRepository) {}

  create(dto: CreateBlogCategoryDto) {
    return this.blogCategoryRepository.create(dto);
  }

  findAll() {
    return this.blogCategoryRepository.findAll();
  }

  async findOne(id: string) {
    const category = await this.blogCategoryRepository.findOne(id);
    if (!category) throw new NotFoundException('Blog category not found');
    return category;
  }

  update(id: string, dto: UpdateBlogCategoryDto) {
    return this.blogCategoryRepository.update(id, dto);
  }

  remove(id: string) {
    return this.blogCategoryRepository.remove(id);
  }
}
