import type { Book } from '../book.entity.js';
import { bigintNumber } from '../../common/bigint-number.js';

export class BookResponseDto {
  bookId: number;
  title: string;
  description: string | null;
  categoryName: string;
  isAvailable: boolean;

  static from(book: Book): BookResponseDto {
    return {
      bookId: bigintNumber.from(book.bookId) as number,
      title: book.title,
      description: book.description ?? null,
      categoryName: book.category.name,
      isAvailable: book.isAvailable,
    };
  }
}
