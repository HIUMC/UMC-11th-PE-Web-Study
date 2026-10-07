import { Injectable, NotFoundException } from '@nestjs/common';
import { BookRepository } from './book.repository.js';
import { BookResponseDto } from './dto/book-response.dto.js';
import type { CreateBookDto } from './dto/create-book.dto.js';
import { bigintNumber } from '../common/bigint-number.js';

@Injectable()
export class BookService {
  constructor(private readonly books: BookRepository) {}

  async findAll(keyword?: string) {
    return (await this.books.findAll(keyword?.trim())).map((book) =>
      BookResponseDto.from(book),
    );
  }

  async create(body: CreateBookDto) {
    const category = await this.books.findCategory(body.categoryId);
    if (!category) throw new NotFoundException('존재하지 않는 카테고리입니다.');
    return BookResponseDto.from(
      await this.books.create(category, body.title, body.description),
    );
  }

  async findByCategory(categoryId: number) {
    return (await this.books.findByCategory(categoryId)).map((book) => ({
      book_id: bigintNumber.from(book.bookId) as number,
      category_id: book.categoryId,
      title: book.title,
      description: book.description,
      is_available: book.isAvailable ? 1 : 0,
    }));
  }
}
