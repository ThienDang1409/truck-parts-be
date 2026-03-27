import { IsNotEmpty, IsString } from 'class-validator';

export class CreateWardDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  code: string;

  @IsString()
  @IsNotEmpty()
  provinceId: string;
}
