import { Injectable, NotFoundException } from '@nestjs/common';
import { WishlistRepository } from './wishlist.repository';
import { AddWishlistItemDto } from './dto/add-wishlist-item.dto';

@Injectable()
export class WishlistService {
  constructor(private readonly wishlistRepository: WishlistRepository) {}

  getWishlist(userId: string) {
    return this.wishlistRepository.findByUser(userId);
  }

  addItem(userId: string, dto: AddWishlistItemDto) {
    return this.wishlistRepository.add(userId, dto);
  }

  async removeItem(id: string) {
    const item = await this.wishlistRepository.findOne(id);
    if (!item) throw new NotFoundException('Wishlist item not found');
    return this.wishlistRepository.remove(id);
  }
}
