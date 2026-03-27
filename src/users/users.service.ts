import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersRepository } from './users.repository';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  private isUniqueConstraintError(error: unknown): boolean {
    if (!error || typeof error !== 'object') {
      return false;
    }

    return 'code' in error && (error as { code?: string }).code === 'P2002';
  }

  create(createUserDto: CreateUserDto) {
    return this.usersRepository.create(createUserDto).catch((error: unknown) => {
      if (this.isUniqueConstraintError(error)) {
        throw new BadRequestException('Email already exists');
      }
      throw new BadRequestException('Failed to create user');
    });
  }

  findAll() {
    return this.usersRepository.findAll();
  }

  async findOne(id: string) {
    const user = await this.usersRepository.findOne(id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    await this.findOne(id);

    try {
      return await this.usersRepository.update(id, updateUserDto);
    } catch (error: unknown) {
      if (this.isUniqueConstraintError(error)) {
        throw new BadRequestException('Email already exists');
      }
      throw new BadRequestException('Failed to update user');
    }
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.usersRepository.remove(id);
  }

  async findByEmail(email: string) {
    return this.usersRepository.findByEmail(email);
  }

  async updateRefreshToken(id: string, refreshToken: string) {
    return this.usersRepository.update(id, { refreshToken } as any);
  }

  async clearRefreshToken(id: string) {
    return this.usersRepository.update(id, { refreshToken: null } as any);
  }

  async findByPreRegisterToken(token: string) {
    return this.usersRepository.findByPreRegisterToken(token);
  }
}
