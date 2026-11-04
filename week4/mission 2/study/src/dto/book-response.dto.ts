import type { Book } from '../entities/book.entity.js';

export class BookResponseDto {
  bookId: number;
  title: string;
  description: string | null;
  categoryName: string;
  isAvailable: boolean;

  constructor(book: Book) {
    this.bookId = book.bookId;
    this.title = book.title;
    this.description = book.description;
    this.categoryName = book.category.name;
    this.isAvailable = book.isAvailable;
  }
}
