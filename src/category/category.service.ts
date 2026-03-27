import { Injectable, NotFoundException } from '@nestjs/common';
import { CategoryRepository } from './category.repository';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoryService {
  constructor(private readonly categoryRepository: CategoryRepository) {}

  create(dto: CreateCategoryDto) {
    return this.categoryRepository.create(dto);
  }

  findAll() {
    return this.categoryRepository.findAll();
  }

  async findOne(id: string) {
    const category = await this.categoryRepository.findOne(id);
    if (!category) throw new NotFoundException('Category not found');
    return category;
  }

  update(id: string, dto: UpdateCategoryDto) {
    return this.categoryRepository.update(id, dto);
  }

  remove(id: string) {
    return this.categoryRepository.remove(id);
  }
}
