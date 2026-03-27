import { Injectable, NotFoundException } from '@nestjs/common';
import { LocationRepository } from './location.repository';
import { CreateProvinceDto } from './dto/create-province.dto';
import { UpdateProvinceDto } from './dto/update-province.dto';
import { CreateWardDto } from './dto/create-ward.dto';
import { UpdateWardDto } from './dto/update-ward.dto';

@Injectable()
export class LocationService {
  constructor(private readonly locationRepository: LocationRepository) {}

  createProvince(dto: CreateProvinceDto) {
    return this.locationRepository.createProvince(dto);
  }

  findAllProvinces() {
    return this.locationRepository.findAllProvinces();
  }

  async findProvinceById(id: string) {
    const province = await this.locationRepository.findProvinceById(id);
    if (!province) throw new NotFoundException('Province not found');
    return province;
  }

  updateProvince(id: string, dto: UpdateProvinceDto) {
    return this.locationRepository.updateProvince(id, dto);
  }

  deleteProvince(id: string) {
    return this.locationRepository.deleteProvince(id);
  }

  createWard(dto: CreateWardDto) {
    return this.locationRepository.createWard(dto);
  }

  findAllWards() {
    return this.locationRepository.findAllWards();
  }

  async findWardById(id: string) {
    const ward = await this.locationRepository.findWardById(id);
    if (!ward) throw new NotFoundException('Ward not found');
    return ward;
  }

  updateWard(id: string, dto: UpdateWardDto) {
    return this.locationRepository.updateWard(id, dto);
  }

  deleteWard(id: string) {
    return this.locationRepository.deleteWard(id);
  }
}
