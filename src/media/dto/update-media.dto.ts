import { IsOptional, IsString } from 'class-validator';

export class UpdateMediaDto {
  @IsOptional()
  @IsString()
  url?: string;

  @IsOptional()
  @IsString()
  type?: string;

  @IsOptional()
  @IsString()
  publicId?: string;
}
