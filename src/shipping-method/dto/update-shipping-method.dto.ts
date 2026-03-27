import { IsOptional, IsString, IsNumber } from 'class-validator';

export class UpdateShippingMethodDto {
  @IsOptional()
  @IsString()
  code?: string;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsNumber()
  price?: number;
}
