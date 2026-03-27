import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProvinceDto } from './dto/create-province.dto';
import { CreateWardDto } from './dto/create-ward.dto';
import { UpdateProvinceDto } from './dto/update-province.dto';
import { UpdateWardDto } from './dto/update-ward.dto';

@Injectable()
export class LocationRepository {
  constructor(private readonly prisma: PrismaService) {}

  createProvince(data: CreateProvinceDto) {
    return this.prisma.province.create({ data });
  }

  findAllProvinces() {
    return this.prisma.province.findMany({ include: { wards: true } });
  }

  findProvinceById(id: string) {
    return this.prisma.province.findUnique({ where: { id }, include: { wards: true } });
  }

  updateProvince(id: string, data: UpdateProvinceDto) {
    return this.prisma.province.update({ where: { id }, data });
  }

  deleteProvince(id: string) {
    return this.prisma.province.delete({ where: { id } });
  }

  createWard(data: CreateWardDto) {
    return this.prisma.ward.create({ data });
  }

  findAllWards() {
    return this.prisma.ward.findMany({ include: { province: true } });
  }

  findWardById(id: string) {
    return this.prisma.ward.findUnique({ where: { id }, include: { province: true } });
  }

  updateWard(id: string, data: UpdateWardDto) {
    return this.prisma.ward.update({ where: { id }, data });
  }

  deleteWard(id: string) {
    return this.prisma.ward.delete({ where: { id } });
  }
}
