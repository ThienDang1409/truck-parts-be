import { Controller, Get, Post, Delete, Param, Body, Request, UseGuards } from '@nestjs/common';
import { WishlistService } from './wishlist.service';
import { AddWishlistItemDto } from './dto/add-wishlist-item.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('wishlist')
@UseGuards(JwtAuthGuard)
export class WishlistController {
  constructor(private readonly wishlistService: WishlistService) {}

  @Get()
  getAll(@Request() req) {
    return this.wishlistService.getWishlist(req.user.userId);
  }

  @Post()
  add(@Request() req, @Body() dto: AddWishlistItemDto) {
    return this.wishlistService.addItem(req.user.userId, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.wishlistService.removeItem(id);
  }
}
