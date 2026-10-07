import { Injectable } from '@nestjs/common';
import { BookRepository } from './book.repository.js';

@Injectable()
export class BookService {
  constructor(private readonly books: BookRepository) {}

  findAll() {
    return this.books.findAll();
  }

  findByCategory(categoryId: number) {
    return this.books.findByCategory(categoryId);
  }

  async create(categoryId: number, title: string, description: string | null) {
    const bookId = await this.books.create(categoryId, title, description);
    return { message: '도서 등록이 완료되었습니다!', bookId };
  }
}
