import { IsEmail, IsString, MinLength, IsOptional, IsEnum } from 'class-validator';
import { Role as PrismaRole } from '@prisma/client';

export interface JwtPayload {
  sub: string;
  email: string;
  role: PrismaRole;
  iat?: number;
  exp?: number;
}

export class SignUpDto {
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
}

export class SignInDto {
  @IsEmail()
  email: string;

  @IsString()
  password: string;
}

export class RefreshTokenDto {
  @IsString()
  refreshToken: string;
}

export class PreRegisterDto {
  @IsEmail()
  email: string;
}

export class CompleteRegisterDto {
  @IsString()
  token: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsOptional()
  @IsString()
  fullName?: string;

  @IsOptional()
  @IsString()
  phone?: string;
}

export class ChangePasswordDto {
  @IsString()
  oldPassword: string;

  @IsString()
  newPassword: string;

  @IsString()
  confirmPassword: string;
}

export class AuthResponseDto {
  accessToken: string;
  refreshToken: string;
  role: PrismaRole;
  user: {
    id: string;
    email: string;
    fullName: string;
    role: PrismaRole;
  };
}

