import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Book } from './book.entity.js';
import { Category } from './category.entity.js';
import { BookResponseDto } from './book-response.dto.js';
import { CreateBookDto } from './create-book.dto.js';

@Injectable()
export class BookService {
  constructor(
    @InjectRepository(Book)
    private readonly bookRepository: Repository<Book>,

    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  // 실습 1: 전체 도서 조회
  async getAllBooks(): Promise<BookResponseDto[]> {
    const books = await this.bookRepository.find({
      relations: {
        category: true,
      },
      order: {
        bookId: 'DESC',
      },
    });

    return books.map((book) => BookResponseDto.from(book));
  }

  // 실습 2: 도서 등록
  async createBook(dto: CreateBookDto): Promise<BookResponseDto> {
    const category = await this.categoryRepository.findOneBy({
      categoryId: dto.categoryId,
    });

    if (!category) {
      throw new NotFoundException('카테고리를 찾을 수 없습니다.');
    }

    const book = this.bookRepository.create({
      category,
      title: dto.title,
      description: dto.description ?? null,
      isAvailable: true,
    });

    const savedBook = await this.bookRepository.save(book);

    return BookResponseDto.from(savedBook);
  }
}