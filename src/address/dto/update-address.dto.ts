import { IsOptional, IsString, IsBoolean } from 'class-validator';

export class UpdateAddressDto {
  @IsOptional()
  @IsString()
  provinceId?: string;

  @IsOptional()
  @IsString()
  wardId?: string;

  @IsOptional()
  @IsString()
  street?: string;

  @IsOptional()
  @IsString()
  postalCode?: string;

  @IsOptional()
  @IsBoolean()
  default?: boolean;
}
