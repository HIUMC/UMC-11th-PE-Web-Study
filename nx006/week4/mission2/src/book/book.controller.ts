import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { BookService } from './book.service.js';
import { CreateBookDto } from './dto/create-book.dto.js';
import { ListBooksQueryDto } from './dto/list-books-query.dto.js';
import { positiveId } from '../common/input.js';

@Controller('books')
export class BookController {
  constructor(private readonly books: BookService) {}

  @Get()
  findAll(@Query() query: ListBooksQueryDto) {
    return this.books.findAll(query.keyword);
  }

  @Post()
  create(@Body() body: CreateBookDto) {
    return this.books.create(body);
  }

  @Get('category/:categoryId')
  findByCategory(@Param('categoryId') categoryId: string) {
    return this.books.findByCategory(positiveId(categoryId, 'categoryId'));
  }
}
