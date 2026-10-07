import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { BookService } from './book.service.js';
import { parseCreateBookInput } from './book.input.js';
import { positiveId } from '../common/input.js';

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
    const { categoryId, title, description } = parseCreateBookInput(body);
    return this.books.create(categoryId, title, description);
  }
}
