import { Body, Controller, Get, Post } from '@nestjs/common';
import { BookService } from './book.service.js';
import { BookResponseDto } from './book-response.dto.js';
import { CreateBookDto } from './create-book.dto.js';

@Controller('books')
export class BookController {
  constructor(private readonly bookService: BookService) {}

  // GET http://localhost:3000/books
  @Get()
  async getBooks(): Promise<BookResponseDto[]> {
    return await this.bookService.getAllBooks();
  }

  // POST http://localhost:3000/books
  @Post()
  async createBook(
    @Body() dto: CreateBookDto,
  ): Promise<BookResponseDto> {
    return await this.bookService.createBook(dto);
  }
}