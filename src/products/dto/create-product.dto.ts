import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { StockStatus } from '@prisma/client';
import { ProductTranslationDto } from './product-translation.dto';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  categoryId: string;

  @IsOptional()
  @IsString()
  subCategoryId?: string;

  @IsOptional()
  @IsString()
  brandId?: string;

  @IsString()
  @IsNotEmpty()
  slug: string;

  @IsString()
  @IsNotEmpty()
  sku: string;

  @IsString()
  @IsNotEmpty()
  partNumber: string;

  @IsNumber()
  @Min(0)
  stockQuantity: number;

  @IsEnum(StockStatus)
  stockStatus: StockStatus;

  @IsNumber()
  @Min(0)
  warrantyMonths: number;

  @IsBoolean()
  isFeatured: boolean;

  @IsBoolean()
  isNew: boolean;

  @IsNumber()
  @Min(0)
  viewCount: number;

  @IsString()
  @IsNotEmpty()
  thumbnailUrl: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  additionalImages?: string[];

  @IsNotEmpty()
  price: string;

  @IsOptional()
  salePrice?: string;

  @ValidateNested({ each: true })
  @Type(() => ProductTranslationDto)
  translations: ProductTranslationDto[];
}
