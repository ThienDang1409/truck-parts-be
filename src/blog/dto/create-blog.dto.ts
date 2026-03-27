import { IsNotEmpty, IsString, IsEnum, IsOptional } from 'class-validator';
import { BlogStatus } from '@prisma/client';

export class CreateBlogDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  slug: string;

  @IsString()
  @IsNotEmpty()
  excerpt: string;

  @IsString()
  @IsNotEmpty()
  content: string;

  @IsString()
  @IsNotEmpty()
  featuredImage: string;

  @IsEnum(BlogStatus)
  status: BlogStatus;

  @IsString()
  @IsNotEmpty()
  authorId: string;

  @IsOptional()
  @IsString()
  categoryId?: string;
}
