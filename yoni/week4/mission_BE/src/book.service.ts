import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { Book } from "./entities/Book.entity.js";
import { Category } from "./entities/category.entity.js";
import { BookResponseDto, CreateBookDto } from "./dto/book-response.dto.js";

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
      relations: {
        category: true,
      },
      order: {
        bookId: "DESC",
      },
    });

    return books.map((book) => BookResponseDto.from(book));
  }

  async createBook(dto: CreateBookDto): Promise<BookResponseDto> {
    const category = await this.categoryRepository.findOneBy({
      categoryId: dto.categoryId,
    });

    if (!category) {
      throw new NotFoundException("존재하지 않는 카테고리입니다.");
    }

    const book = this.bookRepository.create({
      title: dto.title,
      description: dto.description ?? null,
      isAvailable: true,
      category,
    });

    const savedBook = await this.bookRepository.save(book);

    return BookResponseDto.from(savedBook);
  }

  async getBooksByCategory(categoryId: number): Promise<Book[]> {
    return await this.bookRepository.find({
      where: {
        category: {
          categoryId,
        },
      },
      relations: {
        category: true,
      },
    });
  }
}
