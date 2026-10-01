// src/book.controller.ts
import { Controller, Get, Param } from '@nestjs/common';
import { BookService } from './book.service';

@Controller('books')
export class BookController {
  constructor(private readonly bookService: BookService) {}

  // 👇 미션 1 추가 코드: Path Variable로 categoryId 전달받기
  @Get('category/:categoryId')
  async getBooksByCategory(@Param('categoryId') categoryId: string): Promise<any> {
    // URL에서 넘어온 파라미터는 문자열이므로 숫자로 변환합니다.
    return await this.bookService.getBooksByCategory(Number(categoryId));
  }
}