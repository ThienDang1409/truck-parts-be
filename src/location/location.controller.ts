import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { LocationService } from './location.service';
import { CreateProvinceDto } from './dto/create-province.dto';
import { UpdateProvinceDto } from './dto/update-province.dto';
import { CreateWardDto } from './dto/create-ward.dto';
import { UpdateWardDto } from './dto/update-ward.dto';

@Controller('locations')
export class LocationController {
  constructor(private readonly locationService: LocationService) {}

  @Post('provinces')
  createProvince(@Body() dto: CreateProvinceDto) {
    return this.locationService.createProvince(dto);
  }

  @Get('provinces')
  findAllProvinces() {
    return this.locationService.findAllProvinces();
  }

  @Get('provinces/:id')
  findProvince(@Param('id') id: string) {
    return this.locationService.findProvinceById(id);
  }

  @Put('provinces/:id')
  updateProvince(@Param('id') id: string, @Body() dto: UpdateProvinceDto) {
    return this.locationService.updateProvince(id, dto);
  }

  @Delete('provinces/:id')
  deleteProvince(@Param('id') id: string) {
    return this.locationService.deleteProvince(id);
  }

  @Post('wards')
  createWard(@Body() dto: CreateWardDto) {
    return this.locationService.createWard(dto);
  }

  @Get('wards')
  findAllWards() {
    return this.locationService.findAllWards();
  }

  @Get('wards/:id')
  findWard(@Param('id') id: string) {
    return this.locationService.findWardById(id);
  }

  @Put('wards/:id')
  updateWard(@Param('id') id: string, @Body() dto: UpdateWardDto) {
    return this.locationService.updateWard(id, dto);
  }

  @Delete('wards/:id')
  deleteWard(@Param('id') id: string) {
    return this.locationService.deleteWard(id);
  }
}
