import { IsNotEmpty, IsString, IsOptional, IsBoolean } from 'class-validator';

export class CreateBlogCategoryDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  slug: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
