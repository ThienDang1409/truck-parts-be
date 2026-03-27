import { IsEnum, IsInt, IsOptional, IsPositive, IsString } from 'class-validator';
import { OrderStatus } from '@prisma/client';

export class OrderQueryDto {
  @IsOptional()
  @IsInt()
  @IsPositive()
  limit?: number = 10;

  @IsOptional()
  @IsInt()
  @IsPositive()
  offset?: number = 0;

  @IsOptional()
  @IsEnum(OrderStatus)
  status?: OrderStatus;

  @IsOptional()
  @IsString()
  userId?: string;
}
