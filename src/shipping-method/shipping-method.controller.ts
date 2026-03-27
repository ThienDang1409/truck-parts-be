import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { ShippingMethodService } from './shipping-method.service';
import { CreateShippingMethodDto } from './dto/create-shipping-method.dto';
import { UpdateShippingMethodDto } from './dto/update-shipping-method.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../config/roles.enum';

@Controller('shipping-methods')
export class ShippingMethodController {
  constructor(private readonly shippingMethodService: ShippingMethodService) {}

  @Get()
  findAll() {
    return this.shippingMethodService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.shippingMethodService.findOne(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Post()
  create(@Body() dto: CreateShippingMethodDto) {
    return this.shippingMethodService.create(dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateShippingMethodDto) {
    return this.shippingMethodService.update(id, dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.shippingMethodService.remove(id);
  }
}
