import { Module } from '@nestjs/common';
import { SubCategoryService } from './subcategory.service';
import { SubCategoryController } from './subcategory.controller';
import { SubCategoryRepository } from './subcategory.repository';

@Module({
  controllers: [SubCategoryController],
  providers: [SubCategoryService, SubCategoryRepository],
  exports: [SubCategoryService],
})
export class SubCategoryModule {}
