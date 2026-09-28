// src/book.controller.ts
import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { BookService } from './book.service.js';

@Controller('books')
export class BookController {
  constructor(private readonly bookService: BookService) {}

  // 전체 도서 조회
  // GET http://localhost:3000/books
  @Get()
  async getBooks(): Promise<any> {
    return await this.bookService.getAllBooks();
  }

  // 도서 등록
  // POST http://localhost:3000/books
  @Post()
  async createBook(
    @Body() body: Record<string, any>,
  ): Promise<string> {
    return await this.bookService.createBook(body);
  }

  // 특정 카테고리 도서 조회
  // GET http://localhost:3000/books/category/1
  @Get('category/:categoryId')
  async getBooksByCategory(
    @Param('categoryId') categoryId: string,
  ): Promise<any> {
    return await this.bookService.getBooksByCategory(
      Number(categoryId),
    );
  }
}