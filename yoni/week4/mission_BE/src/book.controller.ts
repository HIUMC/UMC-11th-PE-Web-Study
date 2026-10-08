import { Body, Controller, Get, Param, Post } from "@nestjs/common";

import { BookService } from "./book.service.js";
import { BookResponseDto, CreateBookDto } from "./dto/book-response.dto.js";

@Controller("books")
export class BookController {
  constructor(private readonly bookService: BookService) {}

  // GET http://localhost:3000/books
  @Get()
  async getAllBooks(): Promise<BookResponseDto[]> {
    return await this.bookService.getAllBooks();
  }

  // GET http://localhost:3000/books/category/:categoryId
  @Get("category/:categoryId")
  async getBooksByCategory(
    @Param("categoryId") categoryId: string,
  ): Promise<any> {
    return await this.bookService.getBooksByCategory(Number(categoryId));
  }

  // POST http://localhost:3000/books
  @Post()
  async createBook(@Body() dto: CreateBookDto): Promise<BookResponseDto> {
    return await this.bookService.createBook(dto);
  }
}
