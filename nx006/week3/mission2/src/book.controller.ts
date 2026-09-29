import { BadRequestException, Body, Controller, Get, Param, Post } from '@nestjs/common';
import { BookService } from './book.service.js';
import { positiveId } from './input.js';

@Controller('books')
export class BookController {
  constructor(private readonly books: BookService) {}

  @Get()
  findAll() {
    return this.books.findAll();
  }

  @Get('category/:categoryId')
  findByCategory(@Param('categoryId') categoryId: string) {
    return this.books.findByCategory(positiveId(categoryId, 'categoryId'));
  }

  @Post()
  create(@Body() body: Record<string, unknown>) {
    const categoryId = positiveId(body?.categoryId, 'categoryId');
    if (typeof body?.title !== 'string' || !body.title.trim() || body.title.length > 100) {
      throw new BadRequestException('title must be a nonempty string of at most 100 characters');
    }
    if (body.description !== undefined && body.description !== null && typeof body.description !== 'string') {
      throw new BadRequestException('description must be a string or null');
    }
    return this.books.create(categoryId, body.title, (body.description as string | null | undefined) ?? null);
  }
}
