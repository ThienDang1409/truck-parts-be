import { IsNotEmpty, IsString } from 'class-validator';

export class CreateMediaDto {
  @IsString()
  @IsNotEmpty()
  url: string;

  @IsString()
  @IsNotEmpty()
  type: string;

  @IsString()
  @IsNotEmpty()
  publicId: string;
}
