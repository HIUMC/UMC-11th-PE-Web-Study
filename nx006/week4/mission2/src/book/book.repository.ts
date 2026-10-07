import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Book } from './book.entity.js';
import { Category } from '../category/category.entity.js';

@Injectable()
export class BookRepository {
  constructor(
    @InjectRepository(Book) private readonly books: Repository<Book>,
    @InjectRepository(Category)
    private readonly categories: Repository<Category>,
  ) {}

  findAll(keyword?: string): Promise<Book[]> {
    if (!keyword) {
      return this.books.find({
        relations: { category: true },
        order: { bookId: 'DESC' },
        relationLoadStrategy: 'join',
      });
    }
    return this.books
      .createQueryBuilder('book')
      .leftJoinAndSelect('book.category', 'category')
      .where('LOCATE(:keyword, book.title) > 0', { keyword })
      .orderBy('book.bookId', 'DESC')
      .getMany();
  }

  findCategory(categoryId: number) {
    return this.categories.findOneBy({ categoryId: String(categoryId) });
  }

  create(
    category: Category,
    title: string,
    description?: string,
  ): Promise<Book> {
    const book = this.books.create({
      category,
      categoryId: Number(category.categoryId),
      title,
      description: description ?? null,
      isAvailable: true,
    });
    return this.books.save(book);
  }

  findByCategory(categoryId: number): Promise<Book[]> {
    return this.books.find({ where: { categoryId }, order: { bookId: 'ASC' } });
  }
}
