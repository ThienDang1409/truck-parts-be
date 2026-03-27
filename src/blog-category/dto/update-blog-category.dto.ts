import { IsOptional, IsString, IsBoolean } from 'class-validator';

export class UpdateBlogCategoryDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  slug?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
