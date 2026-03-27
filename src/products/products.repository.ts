import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductQueryDto } from './dto/product-query.dto';

@Injectable()
export class ProductsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: ProductQueryDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const skip = (page - 1) * limit;

    const where: any = {
      deletedAt: null,
    };

    if (query.categoryId) {
      where.categoryId = query.categoryId;
    }
    if (query.subCategoryId) {
      where.subCategoryId = query.subCategoryId;
    }
    if (query.brandId) {
      where.brandId = query.brandId;
    }

    if (query.search) {
      const searchCondition = {
        translations: {
          some: {
            name: {
              contains: query.search,
              mode: 'insensitive',
            },
          },
        },
      };
      if (query.lang) {
        (searchCondition.translations.some as any).language = query.lang;
      }
      where.AND = where.AND ? [...where.AND, searchCondition] : [searchCondition];
    }

    let orderBy: any = { createdAt: 'desc' };
    switch (query.sort) {
      case 'price_asc':
        orderBy = { price: 'asc' };
        break;
      case 'price_desc':
        orderBy = { price: 'desc' };
        break;
      case 'newest':
        orderBy = { createdAt: 'desc' };
        break;
      case 'popular':
        orderBy = { viewCount: 'desc' };
        break;
    }

    const [data, total] = await this.prisma.$transaction([
      this.prisma.product.findMany({
        where,
        skip,
        take: limit,
        orderBy,
        include: {
          translations: true,
        },
      }),
      this.prisma.product.count({ where }),
    ]);

    return {
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string) {
    return this.prisma.product.findFirst({
      where: { id, deletedAt: null },
      include: {
        translations: true,
      },
    });
  }

  async incrementViewCount(id: string) {
    return this.prisma.product.update({
      where: { id },
      data: { viewCount: { increment: 1 } },
      include: { translations: true },
    });
  }

  async create(data: CreateProductDto) {
    return this.prisma.product.create({
      data: {
        categoryId: data.categoryId,
        subCategoryId: data.subCategoryId,
        brandId: data.brandId,
        slug: data.slug,
        sku: data.sku,
        partNumber: data.partNumber,
        stockQuantity: data.stockQuantity,
        stockStatus: data.stockStatus,
        warrantyMonths: data.warrantyMonths,
        isFeatured: data.isFeatured,
        isNew: data.isNew,
        viewCount: data.viewCount ?? 0,
        thumbnailUrl: data.thumbnailUrl,
        additionalImages: data.additionalImages ? JSON.stringify(data.additionalImages) : null,
        price: data.price,
        salePrice: data.salePrice,
        translations: {
          create: data.translations.map((t) => ({
            language: t.language,
            name: t.name,
            shortDescription: t.shortDescription,
            description: t.description,
          })),
        },
      },
      include: {
        translations: true,
      },
    });
  }

  async update(id: string, data: UpdateProductDto) {
    const updatePayload: any = {
      ...data,
    };

    if (data.additionalImages !== undefined) {
      updatePayload.additionalImages = data.additionalImages
        ? JSON.stringify(data.additionalImages)
        : null;
    }

    // Do not allow directly updating translations via partial update if undefined.
    if (data.translations) {
      // reset translations then create
      await this.prisma.productTranslation.deleteMany({ where: { productId: id } });
      updatePayload.translations = {
        create: data.translations.map((t) => ({
          language: t.language,
          name: t.name,
          shortDescription: t.shortDescription,
          description: t.description,
        })),
      };
    }

    return this.prisma.product.update({
      where: { id },
      data: updatePayload,
      include: { translations: true },
    });
  }

  async remove(id: string) {
    return this.prisma.product.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}
