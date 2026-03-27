import { IsEmail, IsOptional, IsString, MinLength, IsEnum, IsBoolean } from 'class-validator';
import { Role as PrismaRole } from '@prisma/client';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsString()
  fullName: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsEnum(PrismaRole)
  role?: PrismaRole = PrismaRole.USER;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean = false;

  @IsOptional()
  @IsString()
  preRegisterToken?: string | null;
}

