import { Inject, Injectable } from '@nestjs/common';
import type { Pool, ResultSetHeader } from 'mysql2/promise';
import { DATABASE_CONNECTION } from '../database/database.provider.js';

@Injectable()
export class RentalRepository {
  constructor(@Inject(DATABASE_CONNECTION) private readonly pool: Pool) {}

  async create(userId: number, bookId: number): Promise<number> {
    const [result] = await this.pool.execute<ResultSetHeader>(
      'INSERT INTO rental (user_id, book_id, rented_at, due_at) VALUES (?, ?, NOW(), DATE_ADD(NOW(), INTERVAL 7 DAY))',
      [userId, bookId],
    );
    return result.insertId;
  }

  async returnBook(rentalId: number): Promise<number> {
    const [result] = await this.pool.execute<ResultSetHeader>(
      'UPDATE rental SET returned_at = NOW() WHERE rental_id = ?',
      [rentalId],
    );
    return result.affectedRows;
  }
}
