import { IsOptional, IsEnum, IsInt, IsPositive, IsString } from 'class-validator';
import { BlogStatus } from '@prisma/client';

export class BlogQueryDto {
  @IsOptional()
  @IsInt()
  @IsPositive()
  page?: number = 1;

  @IsOptional()
  @IsInt()
  @IsPositive()
  limit?: number = 10;

  @IsOptional()
  @IsEnum(BlogStatus)
  status?: BlogStatus;

  @IsOptional()
  @IsString()
  categoryId?: string;

  @IsOptional()
  @IsString()
  search?: string;
}
