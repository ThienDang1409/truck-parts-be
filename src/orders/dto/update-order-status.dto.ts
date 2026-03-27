import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { OrderStatus, PaymentStatus } from '@prisma/client';

export class UpdateOrderStatusDto {
  @IsEnum(OrderStatus)
  status: OrderStatus;

  @IsEnum(PaymentStatus)
  paymentStatus: PaymentStatus;

  @IsString()
  @IsNotEmpty()
  note?: string;
}
