import { Injectable, NotFoundException } from '@nestjs/common';
import { CartRepository } from './cart.repository';
import { AddCartItemDto } from './dto/add-cart-item.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';

@Injectable()
export class CartService {
  constructor(private readonly cartRepository: CartRepository) {}

  getCart(userId: string) {
    return this.cartRepository.findByUser(userId);
  }

  async addItem(userId: string, dto: AddCartItemDto) {
    return this.cartRepository.add(userId, dto);
  }

  async updateItem(id: string, dto: UpdateCartItemDto) {
    const item = await this.cartRepository.findOne(id);
    if (!item) throw new NotFoundException('Cart item not found');
    return this.cartRepository.update(id, dto);
  }

  async removeItem(id: string) {
    const item = await this.cartRepository.findOne(id);
    if (!item) throw new NotFoundException('Cart item not found');
    return this.cartRepository.remove(id);
  }

  clear(userId: string) {
    return this.cartRepository.removeAll(userId);
  }
}
