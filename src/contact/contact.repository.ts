import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateContactDto } from './dto/create-contact.dto';

@Injectable()
export class ContactRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(data: CreateContactDto) {
    return this.prisma.contact.create({ data });
  }

  findAll() {
    return this.prisma.contact.findMany({});
  }

  findOne(id: string) {
    return this.prisma.contact.findUnique({ where: { id } });
  }

  markAsRead(id: string) {
    return this.prisma.contact.update({ where: { id }, data: { isRead: true } });
  }
}
