// src/book.service.ts
import { Injectable } from '@nestjs/common';
import { BookRepository } from './book.repository';

@Injectable()
export class BookService {
  // 창고지기(BookRepository)를 주입받습니다.
  constructor(private readonly bookRepository: BookRepository) {}

  async getAllBooks(): Promise<any> {
    return await this.bookRepository.findAll();
  }

  // 👇 미션 1 추가 코드: 컨트롤러에서 받은 카테고리 ID를 리포지토리에 전달
  async getBooksByCategory(categoryId: number): Promise<any> {
    return await this.bookRepository.findByCategoryId(categoryId);
  }
}