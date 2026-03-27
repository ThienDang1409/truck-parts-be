import { Module } from '@nestjs/common';
import { BlogService } from './blog.service';
import { BlogController } from './blog.controller';
import { BlogRepository } from './blog.repository';

@Module({
  controllers: [BlogController],
  providers: [BlogService, BlogRepository],
  exports: [BlogService],
})
export class BlogModule {}
