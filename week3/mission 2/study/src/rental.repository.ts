import { Inject, Injectable } from '@nestjs/common';
import type { Pool, ResultSetHeader, RowDataPacket } from 'mysql2/promise';
import { DATABASE_CONNECTION } from './database.provider.js';

interface RentalDates extends RowDataPacket {
  rentedAt: string;
  dueAt: string;
}

@Injectable()
export class RentalRepository {
  constructor(
    @Inject(DATABASE_CONNECTION) private readonly pool: Pool,
  ) {}

  async create(userId: number, bookId: number) {
    const sql = `
      INSERT INTO rental (user_id, book_id, rented_at, due_at)
      VALUES (?, ?, NOW(), DATE_ADD(NOW(), INTERVAL 7 DAY))
    `;
    const [result] = await this.pool.execute<ResultSetHeader>(sql, [
      userId,
      bookId,
    ]);
    // DB에 실제 저장된 날짜를 문자열로 읽어 시간대 변환 없이 반환합니다.
    const [rows] = await this.pool.execute<RentalDates[]>(
      `SELECT CAST(rented_at AS CHAR) AS rentedAt,
              CAST(due_at AS CHAR) AS dueAt
       FROM rental WHERE rental_id = ?`,
      [result.insertId],
    );

    if (!rows[0]) {
      throw new Error('생성된 대여 기록을 조회하지 못했습니다.');
    }

    return {
      rentalId: result.insertId,
      rentedAt: rows[0].rentedAt,
      dueAt: rows[0].dueAt,
    };
  }
}
