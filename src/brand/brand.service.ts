import { Injectable, NotFoundException } from '@nestjs/common';
import { BrandRepository } from './brand.repository';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';

@Injectable()
export class BrandService {
  constructor(private readonly brandRepository: BrandRepository) {}

  create(dto: CreateBrandDto) {
    return this.brandRepository.create(dto);
  }

  findAll() {
    return this.brandRepository.findAll();
  }

  async findOne(id: string) {
    const brand = await this.brandRepository.findOne(id);
    if (!brand) throw new NotFoundException('Brand not found');
    return brand;
  }

  update(id: string, dto: UpdateBrandDto) {
    return this.brandRepository.update(id, dto);
  }

  remove(id: string) {
    return this.brandRepository.remove(id);
  }
}
