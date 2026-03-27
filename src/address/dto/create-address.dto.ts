import { IsNotEmpty, IsString, IsBoolean, IsOptional } from 'class-validator';

export class CreateAddressDto {
  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsString()
  @IsNotEmpty()
  provinceId: string;

  @IsString()
  @IsNotEmpty()
  wardId: string;

  @IsString()
  @IsNotEmpty()
  street: string;

  @IsOptional()
  @IsString()
  postalCode?: string;

  @IsOptional()
  @IsBoolean()
  default?: boolean;
}
