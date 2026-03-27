import { IsEmail, IsOptional, IsString, MinLength, IsEnum, IsBoolean } from 'class-validator';
import { Role as PrismaRole } from '@prisma/client';

export class UpdateUserDto {
  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  fullName?: string;

  @IsOptional()
  @IsString()
  @MinLength(6)
  password?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsEnum(PrismaRole)
  role?: PrismaRole;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsString()
  preRegisterToken?: string | null;
}

