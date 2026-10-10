// src/book.service.ts
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Book } from './entities/book.entity.js';
import { BookResponseDto } from './dto/book-response.dto.js';
import type { CreateBookDto } from './dto/create-book.dto.js';
import { Category } from './entities/category.entity.js';

@Injectable()
export class BookService {
  constructor(
    @InjectRepository(Book)
    private readonly bookRepository: Repository<Book>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async getAllBooks(): Promise<BookResponseDto[]> {
    const books = await this.bookRepository.find({
      relations: { category: true },
      order: { bookId: 'DESC' },
    });
    return books.map((book) => new BookResponseDto(book));
  }

  async getBooksByCategory(categoryId: number): Promise<BookResponseDto[]> {
    if (!Number.isSafeInteger(categoryId) || categoryId <= 0) {
      throw new BadRequestException('categoryId는 양의 정수여야 합니다.');
    }
    const books = await this.bookRepository.find({
      where: { category: { categoryId } },
      relations: { category: true },
      order: { bookId: 'DESC' },
    });
    return books.map((book) => new BookResponseDto(book));
  }
  async createBook(body: CreateBookDto): Promise<BookResponseDto> {
    const category = await this.categoryRepository.findOneBy({
      categoryId: body.categoryId,
    });
    if (!category) {
      throw new NotFoundException('존재하지 않는 카테고리입니다.');
    }
    const book = this.bookRepository.create({
      title: body.title,
      description: body.description,
      category,
      isAvailable: true,
    });
    const savedBook = await this.bookRepository.save(book);
    return new BookResponseDto(savedBook);
  }
}
