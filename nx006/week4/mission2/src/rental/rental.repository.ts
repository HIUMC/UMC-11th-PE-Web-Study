import { Inject, Injectable } from '@nestjs/common';
import type { ResultSetHeader } from 'mysql2/promise';
import { DataSource } from 'typeorm';

@Injectable()
export class RentalRepository {
  constructor(@Inject(DataSource) private readonly database: DataSource) {}

  async create(userId: number, bookId: number): Promise<number> {
    const result = await this.database.query<ResultSetHeader>(
      'INSERT INTO rental (user_id, book_id, rented_at, due_at) VALUES (?, ?, NOW(), DATE_ADD(NOW(), INTERVAL 7 DAY))',
      [userId, bookId],
    );
    return result.insertId;
  }

  async returnBook(rentalId: number): Promise<number> {
    const result = await this.database.query<ResultSetHeader>(
      'UPDATE rental SET returned_at = NOW() WHERE rental_id = ?',
      [rentalId],
    );
    return result.affectedRows;
  }
}
