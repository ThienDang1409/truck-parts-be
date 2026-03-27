import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(data: CreateUserDto) {
    return this.prisma.user.create({
      data,
      select: {
        id: true,
        email: true,
        fullName: true,
        phone: true,
        avatarUrl: true,
        role: true,
      },
    });
  }

  findAll() {
    return this.prisma.user.findMany({
      where: { deletedAt: null },
      orderBy: {
        createdAt: 'desc',
      },
      select: {
        id: true,
        email: true,
        fullName: true,
        phone: true,
        avatarUrl: true,
        role: true,
        isActive: true,
      },
    });
  }

  findOne(id: string) {
    return this.prisma.user.findFirst({
      where: { id, deletedAt: null },
      select: {
        id: true,
        email: true,
        password: true,
        fullName: true,
        phone: true,
        avatarUrl: true,
        role: true,
        isActive: true,
        lastLogin: true,
        refreshToken: true,
      },
    });
  }

  findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        password: true,
        fullName: true,
        role: true,
        isActive: true,
        refreshToken: true,
        preRegisterToken: true,
      },
    });
  }

  findByPreRegisterToken(token: string) {
    return this.prisma.user.findFirst({
      where: { preRegisterToken: token, deletedAt: null },
      select: {
        id: true,
        email: true,
        password: true,
        fullName: true,
        role: true,
        isActive: true,
        phone: true,
        preRegisterToken: true,
      },
    });
  }

  update(id: string, data: UpdateUserDto) {
    return this.prisma.user.update({
      where: { id },
      data,
      select: {
        id: true,
        email: true,
        fullName: true,
        phone: true,
        avatarUrl: true,
        role: true,
        isActive: true,
      },
    });
  }

  remove(id: string) {
    return this.prisma.user.update({
      where: { id },
      data: { deletedAt: new Date() },
      select: {
        id: true,
        email: true,
      },
    });
  }
}
