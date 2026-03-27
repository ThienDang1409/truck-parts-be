import { Injectable, NotFoundException } from '@nestjs/common';
import { MediaRepository } from './media.repository';
import { CreateMediaDto } from './dto/create-media.dto';
import { UpdateMediaDto } from './dto/update-media.dto';

@Injectable()
export class MediaService {
  constructor(private readonly mediaRepository: MediaRepository) {}

  create(dto: CreateMediaDto) {
    return this.mediaRepository.create(dto);
  }

  findAll() {
    return this.mediaRepository.findAll();
  }

  async findOne(id: string) {
    const media = await this.mediaRepository.findOne(id);
    if (!media) throw new NotFoundException('Media not found');
    return media;
  }

  update(id: string, dto: UpdateMediaDto) {
    return this.mediaRepository.update(id, dto);
  }

  remove(id: string) {
    return this.mediaRepository.remove(id);
  }
}
