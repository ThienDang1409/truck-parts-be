import { IsEnum, IsNumber, IsOptional, IsPositive, IsString } from 'class-validator';
import { Transform } from 'class-transformer';
import { StockStatus } from '@prisma/client';

export enum ProductSortOption {
  PRICE_ASC = 'price_asc',
  PRICE_DESC = 'price_desc',
  NEWEST = 'newest',
  POPULAR = 'popular',
}

export class ProductQueryDto {
  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsNumber()
  @IsPositive()
  page?: number = 1;

  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsNumber()
  @IsPositive()
  limit?: number = 10;

  @IsOptional()
  @IsString()
  lang?: string;

  @IsOptional()
  @IsString()
  categoryId?: string;

  @IsOptional()
  @IsString()
  subCategoryId?: string;

  @IsOptional()
  @IsString()
  brandId?: string;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsEnum(ProductSortOption)
  sort?: ProductSortOption;
}
