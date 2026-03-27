import { IsNotEmpty, IsString, IsNumber } from 'class-validator';

export class CreateShippingMethodDto {
  @IsString()
  @IsNotEmpty()
  code: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  price: number;
}
