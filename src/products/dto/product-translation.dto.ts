import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

export enum ProductLanguage {
  VI = 'vi',
  EN = 'en',
  JA = 'ja',
}

export class ProductTranslationDto {
  @IsEnum(ProductLanguage)
  language: ProductLanguage;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  shortDescription: string;

  @IsString()
  @IsNotEmpty()
  description: string;
}
