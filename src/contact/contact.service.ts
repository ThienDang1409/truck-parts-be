import { Injectable, NotFoundException } from '@nestjs/common';
import { ContactRepository } from './contact.repository';
import { CreateContactDto } from './dto/create-contact.dto';

@Injectable()
export class ContactService {
  constructor(private readonly contactRepository: ContactRepository) {}

  create(dto: CreateContactDto) {
    return this.contactRepository.create(dto);
  }

  findAll() {
    return this.contactRepository.findAll();
  }

  async findOne(id: string) {
    const contact = await this.contactRepository.findOne(id);
    if (!contact) throw new NotFoundException('Contact not found');
    return contact;
  }

  markAsRead(id: string) {
    return this.contactRepository.markAsRead(id);
  }
}
