import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { ProductsRepository } from './products.repository';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductQueryDto } from './dto/product-query.dto';

@Injectable()
export class ProductsService {
  constructor(private readonly productsRepository: ProductsRepository) {}

  async findAll(query: ProductQueryDto) {
    return this.productsRepository.findAll(query);
  }

  async findOne(id: string, lang?: string) {
    const product = await this.productsRepository.findOne(id);
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    const incremented = await this.productsRepository.incrementViewCount(id);

    if (!lang) {
      return incremented;
    }

    const translation = incremented.translations.find((t) => t.language === lang);
    if (translation) {
      return {
        ...incremented,
        translations: [translation],
      };
    }

    return incremented;
  }

  async create(createProductDto: CreateProductDto) {
    try {
      return await this.productsRepository.create(createProductDto);
    } catch (error) {
      throw new BadRequestException('Failed to create product');
    }
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    const existing = await this.productsRepository.findOne(id);
    if (!existing) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    try {
      return await this.productsRepository.update(id, updateProductDto);
    } catch (error) {
      throw new BadRequestException('Failed to update product');
    }
  }

  async remove(id: string) {
    const existing = await this.productsRepository.findOne(id);
    if (!existing) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    return this.productsRepository.remove(id);
  }
}
