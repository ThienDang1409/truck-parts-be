import { Controller, Get, Post, Put, Delete, Param, Body, Request, UseGuards } from '@nestjs/common';
import { CartService } from './cart.service';
import { AddCartItemDto } from './dto/add-cart-item.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('cart')
@UseGuards(JwtAuthGuard)
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  getCart(@Request() req) {
    return this.cartService.getCart(req.user.userId);
  }

  @Post()
  addItem(@Request() req, @Body() dto: AddCartItemDto) {
    return this.cartService.addItem(req.user.userId, dto);
  }

  @Put(':id')
  updateItem(@Param('id') id: string, @Body() dto: UpdateCartItemDto) {
    return this.cartService.updateItem(id, dto);
  }

  @Delete(':id')
  removeItem(@Param('id') id: string) {
    return this.cartService.removeItem(id);
  }

  @Delete()
  clear(@Request() req) {
    return this.cartService.clear(req.user.userId);
  }
}
