import { IsOptional, IsString } from 'class-validator';

export class UpdateWardDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  code?: string;

  @IsOptional()
  @IsString()
  provinceId?: string;
}
