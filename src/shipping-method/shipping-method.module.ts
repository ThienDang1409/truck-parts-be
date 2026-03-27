import { Module } from '@nestjs/common';
import { ShippingMethodService } from './shipping-method.service';
import { ShippingMethodController } from './shipping-method.controller';
import { ShippingMethodRepository } from './shipping-method.repository';

@Module({
  controllers: [ShippingMethodController],
  providers: [ShippingMethodService, ShippingMethodRepository],
  exports: [ShippingMethodService],
})
export class ShippingMethodModule {}
