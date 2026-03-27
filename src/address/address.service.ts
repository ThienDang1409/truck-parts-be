import { Injectable, NotFoundException } from '@nestjs/common';
import { AddressRepository } from './address.repository';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';

@Injectable()
export class AddressService {
  constructor(private readonly addressRepository: AddressRepository) {}

  create(dto: CreateAddressDto) {
    return this.addressRepository.create(dto);
  }

  findAll(userId?: string) {
    return this.addressRepository.findAll(userId);
  }

  async findOne(id: string) {
    const address = await this.addressRepository.findOne(id);
    if (!address) throw new NotFoundException('Address not found');
    return address;
  }

  update(id: string, dto: UpdateAddressDto) {
    return this.addressRepository.update(id, dto);
  }

  remove(id: string) {
    return this.addressRepository.remove(id);
  }
}
