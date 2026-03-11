import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Delete,
  Param,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { PostService } from './posts.service';
import { CreatePostDto, UpdatePostDto } from './dto';

@Controller('posts')
export class PostController {
  constructor(private readonly postService: PostService) {}

  // POST /posts - Tạo bài đăng mới
  @Post()
  create(@Body() createPostDto: CreatePostDto) {
    return this.postService.create(createPostDto);
  }

  // GET /posts - Lấy tất cả bài đăng (có phân trang)
  @Get()
  findAll(
    @Query('skip', new ParseIntPipe({ optional: true })) skip: number = 0,
    @Query('take', new ParseIntPipe({ optional: true })) take: number = 10,
  ) {
    return this.postService.findAll(skip, take);
  }

  // GET /posts/author/:authorId - Lấy bài đăng theo tác giả
  @Get('author/:authorId')
  findByAuthor(
    @Param('authorId', ParseIntPipe) authorId: number,
    @Query('skip', new ParseIntPipe({ optional: true })) skip: number = 0,
    @Query('take', new ParseIntPipe({ optional: true })) take: number = 10,
  ) {
    return this.postService.findByAuthor(authorId, skip, take);
  }

  // GET /posts/:id - Lấy bài đăng theo ID
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.postService.findOne(id);
  }

  // PATCH /posts/:id - Cập nhật bài đăng
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePostDto: UpdatePostDto,
  ) {
    return this.postService.update(id, updatePostDto);
  }

  // PATCH /posts/:id/publish - Xuất bản bài đăng
  @Patch(':id/publish')
  publish(@Param('id', ParseIntPipe) id: number) {
    return this.postService.publish(id);
  }

  // PATCH /posts/:id/unpublish - Bỏ xuất bản bài đăng
  @Patch(':id/unpublish')
  unpublish(@Param('id', ParseIntPipe) id: number) {
    return this.postService.unpublish(id);
  }

  // DELETE /posts/:id - Xóa bài đăng
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.postService.remove(id);
  }
}
