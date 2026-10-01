// src/rental.repository.ts
import { Injectable, Inject } from '@nestjs/common';
import type { Pool } from 'mysql2/promise';
import { DATABASE_CONNECTION } from './database.provider'; // 기존 provider 재사용

@Injectable()
export class RentalRepository {
  constructor(
    @Inject(DATABASE_CONNECTION) private readonly pool: Pool,
  ) {}

  // 미션 2: 대여 기록 삽입 쿼리 작성 (rented_at, due_at 내장 함수 사용)
  async createRental(userId: number, bookId: number): Promise<any> {
    const sql = `
      INSERT INTO rental (user_id, book_id, rented_at, due_at) 
      VALUES (?, ?, NOW(), DATE_ADD(NOW(), INTERVAL 7 DAY))
    `;
    const [result] = await this.pool.query(sql, [userId, bookId]);
    return result;
  }
}