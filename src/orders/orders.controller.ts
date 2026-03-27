import { Controller, Get, Post, Put, Param, Query, Body, UseGuards, Request } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderQueryDto } from './dto/order-query.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../config/roles.enum';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  getMyOrders(@Request() req, @Query() query: OrderQueryDto) {
    const { limit = 10, offset = 0 } = query;
    return this.ordersService.getOrdersForUser(req.user.userId, Number(limit), Number(offset));
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  getOrder(@Request() req, @Param('id') id: string) {
    return this.ordersService.getOrderById(req.user.userId, id);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  createOrder(@Request() req, @Body() dto: CreateOrderDto) {
    return this.ordersService.createOrder(req.user.userId, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/cancel')
  cancelOrder(@Request() req, @Param('id') id: string) {
    return this.ordersService.cancelOrder(req.user.userId, id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Get('all')
  getAllOrders(@Query() query: OrderQueryDto) {
    return this.ordersService.getAll(query);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Put('admin/:id')
  adminUpdateStatus(@Param('id') id: string, @Body() dto: UpdateOrderStatusDto) {
    return this.ordersService.adminUpdateStatus(id, dto);
  }
}
