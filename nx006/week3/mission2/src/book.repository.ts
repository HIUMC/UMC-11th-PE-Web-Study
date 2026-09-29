import { Inject, Injectable } from '@nestjs/common';
import type { Pool, RowDataPacket, ResultSetHeader } from 'mysql2/promise';
import { DATABASE_CONNECTION } from './database.provider.js';

export interface Book extends RowDataPacket {
  book_id: number;
  category_id: number;
  title: string;
  description: string | null;
  is_available: number;
}

@Injectable()
export class BookRepository {
  constructor(@Inject(DATABASE_CONNECTION) private readonly pool: Pool) {}

  async findAll(): Promise<Book[]> {
    const [rows] = await this.pool.execute<Book[]>('SELECT * FROM book');
    return rows;
  }

  async findByCategory(categoryId: number): Promise<Book[]> {
    const [rows] = await this.pool.execute<Book[]>(
      'SELECT * FROM book WHERE category_id = ?',
      [categoryId],
    );
    return rows;
  }

  async create(categoryId: number, title: string, description: string | null): Promise<number> {
    const [result] = await this.pool.execute<ResultSetHeader>(
      'INSERT INTO book (category_id, title, description, is_available) VALUES (?, ?, ?, true)',
      [categoryId, title, description],
    );
    return result.insertId;
  }
}
