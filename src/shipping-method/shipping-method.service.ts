import { Injectable, NotFoundException } from '@nestjs/common';
import { ShippingMethodRepository } from './shipping-method.repository';
import { CreateShippingMethodDto } from './dto/create-shipping-method.dto';
import { UpdateShippingMethodDto } from './dto/update-shipping-method.dto';

@Injectable()
export class ShippingMethodService {
  constructor(private readonly shippingMethodRepository: ShippingMethodRepository) {}

  create(dto: CreateShippingMethodDto) {
    return this.shippingMethodRepository.create(dto);
  }

  findAll() {
    return this.shippingMethodRepository.findAll();
  }

  async findOne(id: string) {
    const method = await this.shippingMethodRepository.findOne(id);
    if (!method) throw new NotFoundException('Shipping method not found');
    return method;
  }

  update(id: string, dto: UpdateShippingMethodDto) {
    return this.shippingMethodRepository.update(id, dto);
  }

  remove(id: string) {
    return this.shippingMethodRepository.remove(id);
  }
}
