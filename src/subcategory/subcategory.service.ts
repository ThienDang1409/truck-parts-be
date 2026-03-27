import { Injectable, NotFoundException } from '@nestjs/common';
import { SubCategoryRepository } from './subcategory.repository';
import { CreateSubCategoryDto } from './dto/create-subcategory.dto';
import { UpdateSubCategoryDto } from './dto/update-subcategory.dto';

@Injectable()
export class SubCategoryService {
  constructor(private readonly subCategoryRepository: SubCategoryRepository) {}

  create(dto: CreateSubCategoryDto) {
    return this.subCategoryRepository.create(dto);
  }

  findAll() {
    return this.subCategoryRepository.findAll();
  }

  async findOne(id: string) {
    const subCategory = await this.subCategoryRepository.findOne(id);
    if (!subCategory) throw new NotFoundException('Subcategory not found');
    return subCategory;
  }

  update(id: string, dto: UpdateSubCategoryDto) {
    return this.subCategoryRepository.update(id, dto);
  }

  remove(id: string) {
    return this.subCategoryRepository.remove(id);
  }
}
